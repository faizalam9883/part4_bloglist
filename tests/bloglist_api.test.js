const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const Blog = require("../models/blog")

// initializing the database before tests
const initialBlogs = [
	{
		title: "About MERN",
		author: "Faiz",
		url: "localhost:3003",
		likes: 10,
	},
	{
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
	},
]
beforeEach(async () => {
	await Blog.deleteMany({})
	const blogObject = initialBlogs.map((blog) => new Blog(blog))
	const promiseArray = blogObject.map((blog) => blog.save())
	await Promise.all(promiseArray)
})

describe("viewing blogs", () => {
	test("blogs are returned as json", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/)
	})

	test("all blogs are returned", async () => {
		const response = await api.get("/api/blogs")
		expect(response.body).toHaveLength(initialBlogs.length)
	})
})

describe("id", () => {
	test("id property is defined", async () => {
		const response = await api.get("/api/blogs")
		expect(response.body[0].id).toBeDefined()
	})
})

describe("create a new blog post", () => {
	test("add one blog successfully", async () => {
		const newBlog = {
			title: "Go To Statement Considered Harmful",
			author: "Edsger W. Dijkstra",
			url:
				"http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
			likes: 5,
		}
		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(200)
			.expect("Content-Type", /application\/json/)

		const response = await api.get("/api/blogs")
		const titles = response.body.map((t) => t.title)
		expect(response.body).toHaveLength(initialBlogs.length + 1)
		expect(titles).toContain("Go To Statement Considered Harmful")
	})
	test("respond with 400 if title and url are missing", async () => {
		const newBlog = {
			author: "Edsger W. Dijkstra",
			likes: 5,
		}
		await api.post("/api/blogs").send(newBlog).expect(400)

		const blogsAtEnd = await api.get("/api/blogs")

		expect(blogsAtEnd.body).toHaveLength(initialBlogs.length)
	})
})

describe("if likes property is missing", () => {
	test("default it to 0", async () => {
		const newBlog = {
			title: "Go To Statement Considered Harmful",
			author: "Edsger W. Dijkstra",
			url:
				"http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		}
		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(200)
			.expect("Content-Type", /application\/json/)

		const blogsAtEnd = await api.get("/api/blogs")
		expect(blogsAtEnd.body[2].likes).toBe(0)
	})
})

describe("modifying blog posts", () => {
	test("blog can be deleted", async () => {
		const blogsAtStart = await api.get("/api/blogs")
		const blogToDelete = blogsAtStart.body[0]

		await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

		const blogsAtEnd = await api.get("/api/blogs")
		expect(blogsAtEnd.body).toHaveLength(initialBlogs.length - 1)
	})
})

afterAll(() => {
	mongoose.connection.close()
})

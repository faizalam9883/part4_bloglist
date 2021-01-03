const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

blogsRouter.get("/api/blogs", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", {
		username: 1,
		name: 1,
		id: 1,
	})
	response.json(blogs)
})

blogsRouter.post("/api/blogs", async (request, response) => {
	const body = request.body
	const token = request.token
	const decodedToken = jwt.verify(token, process.env.SECRET)
	if (!token || !decodedToken.id) {
		return response.status(401).json({ error: "token missing or invalid" })
	}
	const user = await User.findById(decodedToken.id)
	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes || 0,
		user: user._id,
	})
	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()
	response.json(savedBlog)
})

blogsRouter.delete("/api/blogs/:id", async (request, response) => {
	const token = request.token
	const decodedToken = jwt.verify(token, process.env.SECRET)
	if (!token || !decodedToken.id) {
		return response.status(401).json({ error: "token missing or invalid" })
	}
	const user = await User.findById(decodedToken.id)
	const blog = await Blog.findById(request.params.id)
	if (blog.user.toString() === user._id.toString()) {
		await Blog.findByIdAndRemove(request.params.id)
		response.status(204).end()
	} else {
		response.status(400).end()
	}
})

blogsRouter.put("/api/blogs/:id", async (request, response) => {
	const body = request.body
	const blog = {
		likes: body.likes,
	}
	const updatedblog = await Blog.findByIdAndUpdate(request.params.id, blog, {
		new: true,
	})
	response.json(updatedblog)
})

module.exports = blogsRouter

const dummy = (blogs) => {
	return 1
}

// returns the total likes of all authors combined
const totalLikes = (blogs) => {
	return blogs.reduce((total, current) => total + current.likes, 0)
}

// returns the blog which has the most number of likes
const favoriteBlog = (blogs) => {
	let max = 0
	let most = {}
	blogs.map((blog) => {
		if (blog.likes > max) {
			max = blog.likes
			most = blog
		}
	})
	return {
		title: most.title,
		author: most.author,
		likes: most.likes,
	}
}

//return the author who has the largest number of blogs along with the number of blogs
const mostBlogs = (blogs) => {
	// make an array of authors' names
	const authors = blogs.map((blog) => blog.author)
	// make an object which has the authors' name along with its frequency
	const obj = {}
	authors.forEach((author) => {
		if (obj[author] === undefined) obj[author] = 1
		else obj[author] += 1
	})

	let max = 0,
		pos = 0
	let keys = Object.keys(obj)
	let values = Object.values(obj)
	// find position of highest frequency
	for (let i = 0; i < values.length; i++) {
		if (values[i] > max) {
			max = values[i]
			pos = i
		}
	}
	const returnObj = {
		author: keys[pos], // author's name which is at same position as highest frequency
		blogs: values[pos],
	}
	return returnObj
}

// returns the author with the most likes
const mostLikes = (blogs) => {
	const obj = {}
	blogs.forEach((blog) => {
		if (obj[blog.author] === undefined) obj[blog.author] = blog.likes
		else obj[blog.author] += blog.likes
	})
	const authors = Object.keys(obj)
	const likes = Object.values(obj)
	let max = 0,
		pos = 0
	for (let i = 0; i < likes.length; i++) {
		if (likes[i] > max) {
			max = likes[i]
			pos = i
		}
	}
	const returnObj = {
		author: authors[pos],
		likes: likes[pos],
	}
	return returnObj
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
}

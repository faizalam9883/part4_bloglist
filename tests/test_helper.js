const User = require("../models/user")

const initialusers = [
	{
		username: "faizalam9883",
		name: "Faiz Alam",
		password: "alam@123",
	},
	{
		username: "moizalam",
		name: "Moiz Alam",
		password: "alam@123",
	},
]

const nonExistingId = async () => {
	const user = new User({ username: "willremovethissoon", name: "random" })
	await user.save()
	await user.remove()

	return user._id.toString()
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map((user) => user.toJSON())
}

module.exports = {
	initialusers,
	nonExistingId,
	usersInDb,
}

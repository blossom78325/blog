import mongoose from "mongoose";
import moment from "moment";

interface User {
	name: string;
	email: string;
	password: string;
	role?: string;
	register_date?: Date;
	comments: Comment[];
	posts: mongoose.Schema.Types.ObjectId[]
}

interface Comment {
	post_id: mongoose.Schema.Types.ObjectId;
	comment_id: mongoose.Schema.Types.ObjectId;
}



// Create Schema
const UserSchema = new mongoose.Schema<User>({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ["MainManager", "SubManager", "User"],
		default: "User",
	},
	register_date: {
		type: Date,
		default: moment().format("YYYY-MM-DD hh:mm:ss"),
	},
	comments: [
		{
			post_id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "post",
			},
			comment_id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "comment",
			},
		},
	],
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "post",
		},
	],
});

const User = mongoose.model("user", UserSchema);

export default User;

import express from 'express';
import Post from '../../models/post';
import {auth} from "../../middleware/auth";

const router = express.Router();

router.get('/', async (req, res) => {
	const postFindResult = await Post.find();
	console.log(postFindResult, 'All Post Get');
	res.json(postFindResult);
});

router.post('/', auth, async (req, res) => {
	try {
		console.log({req});
		const {title, contents, fileUrl, creator} = req.body;

		if (!title || !contents) {
			return res.status(400).json({msg: '필수 항목을 모두 입력해주세요.'});
		}

		const newPost = await Post.create({
			title, contents, fileUrl, creator,
		});
		res.json(newPost);
	} catch (e) {
		console.log(e);
	}
});

export default router;

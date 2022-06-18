import express from 'express';
import User from '../../models/user';
import {config} from '../../config';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const {JWT_SECRET} = config

const router = express.Router();

// @routes GET api/user
// @desc Get all user
// @access public

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        if (!users) throw Error('No users');
        res.status(200).json(users);
    } catch (e) {
        console.log(e);
        if (e instanceof Error) res.status(400).json({msg: e.message});
    }
});

// @routes POST api/user
// @desc Register all user
// @access public

router.post('/', async (req, res) => {
    try {
        const {name, email, password} = req.body;
        console.log(req.body)

        if (!name || !email || !password) {
            return res.status(400).json({msg: '필수 항목을 모두 입력해주세요.'});
        }

        User.findOne({email}).then((user) => {
            if (user) return res.status(400).json({msg: "이미 가입된 계정입니다."})
        })

        const newUser = new User({name, email, password})

        // salt: a salt is random data that is used as an additional input to a one-way function that hashes data, a password or passphrase.
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;

                newUser.password = hash;
            })
        })

        newUser.save().then((user) => {
                jwt.sign(
                    {id: user.id},
                    JWT_SECRET,
                    {expiresIn: 3600},
                    (err, token) => {
                        if (err) throw err;
                        res.json({
                            token,
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email
                            }
                        })
                    }
                )
            }
        )
    } catch (e) {
        console.log(e);
        if (e instanceof Error) res.status(400).json({msg: e.message});
    }
});

export default router

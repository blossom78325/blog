import {config} from '../../config';
import express from 'express';
import User from '../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {auth} from '../../middleware/auth';

const {JWT_SECRET} = config;

const router = express.Router();

// @routes GET api/auth/login
// @desc Login user
// @access public

router.post('/login', (req, res) => {
  const {email, password} = req.body;

  if (!email || !password)
    return res.status(400).json({msg: '모든 필드를 채워주세요.'});

  User.findOne({email}).then(user => {
    if (!user) return res.status(400).json({msg: '유저가 존재하지 않습니다.'});

    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch)
        return res.status(400).json({msg: '비밀번호가 일치하지 않습니다.'});

      jwt.sign(
        {id: user.id},
        JWT_SECRET,
        {expiresIn: '2 days'},
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          });
        },
      );
    });
  });
});

// @routes GET api/auth/logout
// @desc Logout user
// @access public

router.post('/logout', (req, res) => {
  res.json('로그아웃 되었습니다.');
});

// @routes GET api/auth/user
// @desc get the information of the user
// @access public

router.get('/user', auth, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) throw Error('유저가 존재하지 않습니다.');

    res.json({user});
  } catch (e) {
    console.log(e);
    if (e instanceof Error) res.status(400).json({msg: e.message});
  }
});

export default router;

import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

//All database queries are async
export const createNewUser = async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password),
      },
    });

    const token = createJWT(user);
    res.json({ token });
  } catch (e) {
    e.type = 'input'
    // res.status(500).json({message: e.message})
    next(e)
  }
};

export const signin = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
      // Can't send plain password cuz in db it's hashed
    },
  });

  //Async because bcrypt returns a promise by default
  const isValid = await comparePasswords(req.body.password, user.password);

  if (!isValid) {
    res.status(401);
    res.json({ message: "Password incorrect" });
    return;
  }

  const token = createJWT(user);
  res.json({ token });
};

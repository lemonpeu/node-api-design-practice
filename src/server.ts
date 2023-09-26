import express from 'express'
import router from './routes'
import morgan from 'morgan'
import { protect } from './modules/auth';
import { createNewUser, signin } from './handlers/user';

const app = express();

app.use(morgan('dev'))

//Otro middleware para que se envíen sólo json
app.use(express.json())

//Permite que el cliente agregue un query string y decodes eso apropiadamente
app.use(express.urlencoded({extends: true}))

app.get('/', (req, res) => {
  console.log("Hello from express")
  res.status(200)
  res.json({message: "Hello"})
})

app.use('/api', protect, router)
app.post('/user', createNewUser)
app.post('/signin', signin)

app.use((err, req, res, next) => {
  if(err.type === 'auth') {
    res.status(401).json({message: 'Unauthorized'})
  } else if (err.type === 'input') {
    res.status(400).json({message: 'Invalid input'})
  } else {
    res.status(500).json({message: 'Server error'})
  }
})

export default app
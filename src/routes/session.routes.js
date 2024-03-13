import { Router } from 'express'
import usersManager from '../dao/mongo/UsersManager.js'

const router = Router()

router.post('/register', async (req, res) => {

	if (!req.body) {
		throw new Error('La solicitud no contiene datos válidos para el registro.')
	}

	try {
		const firstName = req.body.first_name
		const lastName = req.body.last_name
		const age = req.body.age
		const email = req.body.email
		const password = req.body.password

		const createdUser = await usersManager.createUser(firstName, lastName, age, email, password)

		res.status(200).json({ 'status': 'success', 'payload': createdUser })
	} catch (error) {
		if (error == 'Error: Missing required data.' || error == 'Error: User email already exists.') {
			res.status(400).json({ 'status': 'error', 'payload': `${error}` })
		} else {
			res.status(500).json({ 'status': 'error', 'payload': `${error}` })
		}
	}
})

router.post('/login', async (req, res) => {
	if (!req.body) {
		throw new Error('La solicitud no contiene datos válidos para el inicio de sesión.')
	}

	try {
		const user = await usersManager.getUser(req.body.email, req.body.password)

		if (user) {
			req.session.user = user

			res.status(200).send({ 'status': 'success', 'payload': user })
		}
	} catch (error) {
		if (error == 'Error: Usuario no encontrado.' || error == 'Error: Contraseña invalida.') {
			res.status(401).json({ 'status': 'error', 'message': `${error}` })
		} else {
			res.status(500).json({ 'status': 'error', 'message': `${error}` })
		}
	}
})

router.delete('/logout', async (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send({ 'status': 'error', 'message': 'Ha ocurrido un error al intentar cerrar sesión.' })
		} else {
			res.clearCookie('connect.sid')
			res.status(200).json({ 'status': 'success', 'message': 'Sesión cerrada exitosamente.' })
		}
	})
})

export default router
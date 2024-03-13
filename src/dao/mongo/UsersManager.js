import userModel from '../models/user.model.js'
import cartManager from './CartsManager.js'

class UsersManager {
	
	createUser = async (firstName, lastName, age, email, password) => {
		
		if(!firstName || !lastName || !age || !email || !password) {
			throw new Error('Missing required data.')
		}

		try{
			const newCart = await cartManager.createEmptyCart()

			const newUser = {
				first_name: firstName.trim(),
				last_name: lastName.trim(),
				age: parseInt(age),
				email: email.trim(),
				password: password.trim(),
				role: 'user',
				cart: newCart._id
			}

			if(!newUser.first_name || !newUser.last_name || !newUser.age || !newUser.email || !newUser.password) {
				throw new Error('Missing required data.')
			}

			const emailExists = await userModel.findOne({ email: newUser.email })
	
			if(emailExists){ 
				throw new Error('User email already exists.')
			}

			if(newUser.email === 'adminCoder@coder.com' && newUser.password === 'adminCod3r123'){
				newUser.role = 'admin'
			}

			const createdUser = await userModel.create(newUser)
			
			return createdUser
		} catch(error) {
			if(error == 'Error: Missing required data.' || error == 'Error: User email already exists.'){
				throw error
			} else {
				throw new Error(error)
			}
		} 
	}

	getUser = async (email, password) => {
		if (!email || !password) {
			throw new Error('Se requieren los campos de correo electrónico y contraseña.')
		}
    
		try {
			const user = await userModel.findOne({ email: email })
    
			if (!user){
				throw new Error('Usuario no encontrado.')
			} 
    
			if (user.password !== password){
				throw new Error('Contraseña invalida.')
			} 
    
			return user
		} catch (error) {
			if(error == 'Error: Usuario no encontrado.' || error == 'Error: Contraseña invalida.'){
				throw error
			} else {
				throw new Error(error)
			}
		}
	}

	updateUser = async (userId, fieldToUpdate, update) => {
		if(!userId || !fieldToUpdate || !update) throw new Error('Missing required data')
    
		try{
			const updatedUser = await userModel.findByIdAndUpdate(userId, { [fieldToUpdate]: update }, { new: true })
    
			return updatedUser
		} catch(error){
			throw new Error(`Error trying to update the user: ${error}`)
		}
	}
    

	deleteUser = async (userId) => {
		if(!userId) throw new Error('Missing required data')

		try{
			const deletedUser = await userModel.findByIdAndDelete(userId)

			return deletedUser
		} catch (error) {
			throw new Error(`Error trying to delete the user: ${error}`)
		}
	}
}

const usersManager = new UsersManager()

export default usersManager
document.addEventListener('DOMContentLoaded', () => {
	const registerForm = document.getElementById('registerForm')

	registerForm.addEventListener('submit', (event) => {
		event.preventDefault()
		const firstName = document.getElementById('firstName')
		const lastName = document.getElementById('lastName')
		const age = document.getElementById('age')
		const email = document.getElementById('email')
		const password = document.getElementById('password')

		const firstNameValue = firstName.value.trim()
		const lastNameValue = lastName.value.trim()
		const ageValue = parseInt(age.value)
		const emailValue = email.value.trim()
		const passwordValue = password.value.trim()

		if (isNaN(ageValue) || ageValue < 0 || ageValue > 120) {
			alert('Por favor, ingrese una edad válida entre 0 y 120.')
			return
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(emailValue)) {
			alert('Por favor, ingrese una dirección de correo electrónico válida.')
			return
		}

		if (!firstNameValue || !lastNameValue || !emailValue || !passwordValue) {
			alert('Por favor, complete todos los campos obligatorios.')
			return
		}

		const newUser = {
			first_name: firstNameValue,
			last_name: lastNameValue,
			age: ageValue,
			email: emailValue,
			password: passwordValue
		}

		fetch('http://localhost:8080/api/session/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newUser)
		})
			.then((res) => {
				if (res.ok) {
					registerForm.reset()
					window.location.href = '/session/login'
				} else {
					console.log(res)
					throw new Error('No se pudo registrar el usuario. Respuesta del servidor no exitosa.')
				}
			})
			.catch((error) => {
				alert(`Ha ocurrido un error al intentar registrar su usuario: ${error}`)
			})
	})
})
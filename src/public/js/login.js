document.addEventListener('DOMContentLoaded', () => {
	const loginForm = document.getElementById('loginForm')
    
	loginForm.addEventListener('submit', (event) => {
		event.preventDefault()

		const email = document.getElementById('email')
		const password = document.getElementById('password')
        
		const emailValue = email.value
		const passwordValue = password.value

		const formattedEmailValue = emailValue.trim()
		const formattedPasswordValue = passwordValue.trim()
        
		const user = {
			email: formattedEmailValue,
			password: formattedPasswordValue
		}

		fetch('http://localhost:8080/api/session/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		})
			.then((res) => {
				if (res.ok) {
					loginForm.reset()
					window.location.href = '/products'
				} else {
					res.json().then((data) => {
						if(data.message === 'Error: Usuario no encontrado.'){
							email.classList.toggle('is-invalid')

							email.addEventListener('input', () => {
								email.classList.remove('is-invalid')
							})

						} else if(data.message === 'Error: Contraseña invalida.'){
							password.classList.toggle('is-invalid')

							password.addEventListener('input', () => {
								password.classList.remove('is-invalid')
							})
						} else {
							alert(`${data.message}`)
						}
					})
				}
			})
			.catch((error) => {
				alert(`${error}`)
			})
		
	})
})
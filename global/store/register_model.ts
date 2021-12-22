import { getUserData, instance, setIsTokenUpdated, setUser } from './store'
import { createEffect, createEvent, createStore } from 'effector'

type RegisterDetailsType = {
	firstName: string
	lastName: string
	phoneNumber: string | null 
	email: string | null
	password: string 
	gender: string
	dateRegister: string
} | null

export const sendRegData = createEffect()
export const getUsers = createEffect()

export const setRegisterDetails = createEvent<RegisterDetailsType>()
export const $registerDetails = createStore<RegisterDetailsType>(null).on(
	setRegisterDetails,
	(_, newRegDetails) => {
		return newRegDetails
	}
) 

sendRegData.use(async (regDetails) => {
	const data = await instance.post('user/register-user', JSON.stringify(regDetails))
	console.log(data)
	if(data.status === 200) {
		localStorage.setItem('access-token', data.data.access_token);
		localStorage.setItem('refrash-token', data.data.resresh_token);
	}
	return data;
})

getUsers.use(async () => {
	const data = await instance.get('user/get-users')
	console.log(data)
	return data
})

import axios from 'axios'
import { createEvent, createStore } from 'effector'

export const baseURL = 'https://api.meetins.ru/';
export const instance = axios.create({
	baseURL: baseURL,
	headers: {
        'Content-Type': 'application/json'
    }
})
instance.interceptors.request.use((config: any) => {
	if(localStorage.getItem('access-token') !== '') {
		config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('access-token');
	}
	return config;
}, (errors: any) => {
	return Promise.reject(errors);
})
instance.interceptors.response.use((res: any) => {
	setIsAsyncLoaded(false);
	if(res.status === 200) { 
		setIsAsyncLoaded(true); 
		return res; 
	}
}, (errors: any) => {
	if(errors.response.status === 401 || errors.response.status === 401) {
		setIsAsyncLoaded(false);
		updateTokens().then((res: any) => {
			if(res.status <= 227) {
				const config = errors.config;
				config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('access-token');
				axios.request(config).then((res) => {
					if(res.status === 200) {
						if(axios.getUri(config).includes("/profile/")) {
							setUser(res.data)
						}
						setIsAsyncLoaded(true);
					}
				})
			}
		})
		return Promise.reject(errors);
	}
})



export type User = {
	firstName: string,
	lastName: string,
	phoneNumber: string,
	email: string,
	gender: string,
	userIcon: string,
	dateRegister: string,
	loginUrl: string,
	birthDate: string
}
export type ProfileData = {
	firstNameAndLastName: string,
	phoneNumber: string,
	birthDate: string
}
export type AccountData = {
	email: string,
	password: string,
	loginUrl: string
}

export const setIsAsyncLoaded = createEvent<boolean>();
export const isAsyncLoaded = createStore<boolean>(false).on(setIsAsyncLoaded, (_, tokenUpdated) => {
	return tokenUpdated;
})

export const setUser = createEvent<User | null>()
export const $user = createStore<User | null>(null).on(setUser, (_, userDetails) => {
	return userDetails
})

export const setCurrentPage = createEvent<string>()
export const $currentPage = createStore<string>('').on(
	setCurrentPage,
	(_, currPage) => {
		localStorage.setItem('previousPage', `${currPage}`);
		return currPage;
	}
)

export const getUserData = async () => {
	const response = await instance.get('profile/my-profile');
	if(response.status === 200) {
		setUser(response.data);
	}
	return response;
}
export const getUserDataByLoginUrl = async (loginUrl: string | string[] | undefined) => {
	setIsAsyncLoaded(false);
	const response = await instance.post('profile/by-loginurl', JSON.stringify(loginUrl));
	return response;
}
export const updateTokens = async () => {
	const response = await instance.post('user/refresh-token', {refreshToken: localStorage.getItem('refrash-token')});
	localStorage.setItem('access-token', response.data.accessToken);
	localStorage.setItem('refrash-token', response.data.refreshToken);
	return response;
}
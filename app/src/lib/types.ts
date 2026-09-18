// TypeScript DTOs migrated from the WinDev classes csProduct / csUser
// (and the nested classes csHair, csAddress, csCoordinates, csBank, csCompany, csCrypto).

export interface Product {
	IDproduct: number;
	name: string;
	description: string;
	price: number;
	isActive: boolean;
}

export interface Hair {
	color: string;
	type: string;
}

export interface Coordinates {
	lat: number;
	lng: number;
}

export interface Address {
	address: string;
	city: string;
	coordinates: Coordinates;
	postalCode: string;
	state: string;
}

export interface Bank {
	cardExpire: string;
	cardNumber: string;
	cardType: string;
	currency: string;
	iban: string;
}

export interface Company {
	name: string;
	title: string;
	department: string;
	address: Address;
}

export interface Crypto {
	coin: string;
	wallet: string;
	network: string;
}

export interface User {
	id: number;
	firstName: string;
	lastName: string;
	maidenName: string;
	age: number;
	gender: string;
	email: string;
	phone: string;
	username: string;
	password: string;
	birthDate: string;
	image: string;
	bloodGroup: string;
	height: number;
	weight: number;
	eyeColor: string;
	hair: Hair;
	domain: string;
	ip: string;
	macAddress: string;
	university: string;
	userAgent: string;
	address: Address;
	bank: Bank;
	company: Company;
	ein: string;
	ssn: string;
	crypto: Crypto;
}

export interface UsersApiResponse {
	users: User[];
	total: number;
	skip: number;
	limit: number;
}

import AppError from '@shared/errors/AppError';

import { i18n } from '../http/internationalization';
import { removeSpecialCharacters } from './stringUtil';

export function emailIsValid(email: string): boolean {
  if (!email) {
    return false;
  }
  email = email.trim();
  email = email.toLowerCase();
  if (email.length > 150) {
    return false;
  }
  const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
  return regexEmail.test(email);
}

export function phoneIsValid(phone: string): boolean {
  if (!phone) {
    return false;
  }
  phone = phone.trim();
  phone = removeSpecialCharacters(phone);
  if (phone.length < 10 || phone.length > 11) {
    return false;
  }
  if (phone.startsWith('0')) {
    return false;
  }
  const items = [...new Set(phone)];
  if (items.length === 1) {
    return false;
  }
  return true;
}

function verifierDigitCNPJ(digits: string): number {
  let index = 2;
  const sum = [...digits].reverse().reduce((buffer, number) => {
    buffer += Number(number) * index;
    index = index === 9 ? 2 : index + 1;
    return buffer;
  }, 0);
  const mod = sum % 11;
  return mod < 2 ? 0 : 11 - mod;
}

export function cnpjIsValid(value: string): boolean {
  if (!value) {
    return false;
  }
  value = value.trim();
  value = removeSpecialCharacters(value);

  // Guarda um array com todos os dígitos do valor
  const match = value.toString().match(/\d/g);
  const numbers = Array.isArray(match) ? match.map(Number) : [];

  // Valida a quantidade de dígitos
  if (numbers.length !== 14) return false;

  // Elimina inválidos com todos os dígitos iguais
  const items = [...new Set(numbers)];
  if (items.length === 1) return false;

  let registration = value.substr(0, 12);
  registration += verifierDigitCNPJ(registration);
  registration += verifierDigitCNPJ(registration);

  return registration.substr(-2) === value.substr(-2);
}

function verifierDigitCPF(numbers: string): number {
  const numberList = numbers.split('').map(number => parseInt(number, 10));
  const modulus = numberList.length + 1;
  const multiplied = numberList.map((number, index) => number * (modulus - index));
  const mod = multiplied.reduce((buffer, number) => buffer + number) % 11;
  return mod < 2 ? 0 : 11 - mod;
}

export function cpfIsValid(value: string): boolean {
  if (!value) {
    return false;
  }
  value = value.trim();
  value = removeSpecialCharacters(value);

  const match = value.toString().match(/\d/g);
  const numbersArray = Array.isArray(match) ? match.map(Number) : [];

  // CPF must have 11 chars
  if (numbersArray.length !== 11) return false;

  const items = [...new Set(numbersArray)];
  if (items.length === 1) return false;

  let numbers = value.substr(0, 9);

  numbers += verifierDigitCPF(numbers);
  numbers += verifierDigitCPF(numbers);

  return numbers.substr(-2) === value.substr(-2);
}

export function passwordValid(password: string): string {
  if (!password) {
    throw new AppError(i18n('user.enter_the_password'));
  }
  if (password.length < 8) {
    throw new AppError(i18n('user.password_must_contain_least_characters'));
  }
  if (!password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
    throw new AppError(i18n('user.the_password_must_contain_at_least_letter_and_number'));
  }
  return '';
}

export function zipCodeIsValid(zipCode: string): boolean {
  if (!zipCode) {
    return false;
  }
  zipCode = zipCode.trim();
  zipCode = removeSpecialCharacters(zipCode);
  const match = zipCode.toString().match(/\d/g);
  const numbersArray = Array.isArray(match) ? match.map(Number) : [];

  if (numbersArray.length !== 8) return false;

  const items = [...new Set(numbersArray)];

  if (items.length === 1) return false;

  return true;
}

import * as Yup from 'yup';
import { registerForPushNotificationsAsync, lowCandyNotification, lowLiquidNotification, lowResourcesNotification } from './notifications';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
});

export const signupValidationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm Password must match password.')
    .required('Confirm Password is required.'),
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required('Please enter a registered email')
    .label('Email')
    .email('Enter a valid email'),
});

export const DispenseSchema = Yup.object().shape({
  liquidText: Yup.string().required().label('Liquid amount'),
  candyText: Yup.string().required().label('Candy amount'),
});

export const GlucoseSchema = Yup.object().shape({
  glucoseText: Yup.string().required().label('Glucose amount')
})

export { registerForPushNotificationsAsync, lowCandyNotification, lowLiquidNotification, lowResourcesNotification };
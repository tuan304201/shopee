import * as yup from 'yup'
import { AnyObject } from 'yup'

function testPriceMinMax(this: yup.TestContext<AnyObject>) {
  const { price_max, price_min } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .trim()
    .required('Nhập lại password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref(refString)], 'Nhập lại password không khớp')
}

export const schema = yup.object({
  email: yup
    .string()
    .trim()
    .required('Email là bắt buộc.')
    .email('Đây không phải là email.')
    .min(5, 'Độ dài từ 5 - 160 ký tự.')
    .max(160, 'Độ dài từ 5 - 160 ký tự.'),
  password: yup
    .string()
    .trim()
    .required('Mật khẩu là bắt buộc.')
    .min(6, 'Độ dài từ 6 - 160 ký tự.')
    .max(160, 'Độ dài từ 6 - 160 ký tự.'),
  confirm_password: handleConfirmPasswordYup('new_password'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  name: yup.string().trim().required('Tên sản phẩm là bắt buộc')
})

export const userSchema = yup.object({
  name: yup.string().trim().max(160, 'Độ dài tối đa 160 ký tự'),
  phone: yup.string().trim().max(20, 'Độ dài tối đa 20 ký tự'),
  address: yup.string().trim().max(160, 'Độ dài tối đa 160 ký tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa 1000 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Ngày sinh không hợp lệ'),
  password: yup
    .string()
    .trim()
    .required('Mật khẩu là bắt buộc.')
    .min(6, 'Độ dài từ 6 - 160 ký tự.')
    .max(160, 'Độ dài từ 6 - 160 ký tự.'),
  new_password: yup
    .string()
    .trim()
    .required('Mật khẩu là bắt buộc.')
    .min(6, 'Độ dài từ 6 - 160 ký tự.')
    .max(160, 'Độ dài từ 6 - 160 ký tự.'),
  confirm_password: handleConfirmPasswordYup('new_password')
})

export type UserSchema = yup.InferType<typeof userSchema>

export type Schema = yup.InferType<typeof schema>

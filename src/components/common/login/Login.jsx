// import React, { useState } from 'react'
// import './login.scss'
// import Cookies from 'js-cookie';
// import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx';
// import { loginAdmin } from '../../../redux/features/admin/authSlice';
// import { loginUser } from '../../../redux/features/user/authSlice';
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import Image from '../../../assets/images/alliance-logo.png'
// import NormalInput from '../inputs/NormalInput';
// import SingleButton from '../buttons/SingleButton';
// import MobileInput from '../inputs/MobileInput'
// import { getDeviceAndBrowserInfo, deviceIdBuilder } from '../../../assets/javascript/device-helpers'
// import { toast } from '../../../redux/features/user/systemSlice'

// function Login({ admin }) {
//   const dispatch = useDispatch()
//   const navigate = useNavigate();
//   const [show, setShow] = useState(false)
//   const [form, setForm] = useState({ user_name: null, primary_number: {}, password: null })
//   const { isLoading } = useSelector((state) => state.userAuth)
//   const dvcId = Cookies.get('DVC_ID');


//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleMobileNumber = (mobData) => {
//     setForm({
//       ...form,
//       [mobData.name]: mobData?.number
//         ? {
//           country_code: mobData?.country_code || null,
//           number: mobData?.number || null
//         }
//         : undefined
//     })
//   }

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     if (admin) {
//       dispatch(loginAdmin(form)).then((res) => {
//         if (!res?.error) {
//           navigate('/admin')
//         }
//       })
//     }


//     if (!admin) {
//       // Validation form
//       if (!form?.primary_number?.number || form?.primary_number?.number?.length < 7) {
//         dispatch(toast.push.error({ message: 'Enter valid country mobile number formate' }))
//         return;
//       }

//       // Staff Login
//       const loginCredentials = {
//         country_code: form?.primary_number?.country_code || null,
//         mobile_number: form?.primary_number?.number || null,
//         password: form?.password || null,
//         dvc_id: dvcId || deviceIdBuilder(),
//         new_device: !dvcId && await getDeviceAndBrowserInfo()
//       }



//       dispatch(loginUser(loginCredentials)).then((res) => {
//       
//         if (!res?.error) {
//           navigate('/')
//         }
//       })
//     }
//   }

//   return (
//     <div className='login-comp-main-div'>
//       <div className="login-comp">
//         <div className="left-div">
//           <div className="image-div">
//             <img src={Image} alt='login-svg' />
//           </div>
//           <h3>{admin ? "Admin" : 'Account'} Sign In</h3>
//           {admin
//             ? <p>Login account using user name and password</p>
//             : <p>Login your account using mobile number and password</p>}

//         </div>
//         <div className="right-div">
//           <div className="section-div  input-section">
//             <form onSubmit={onSubmit}>
//               {admin
//                 ? <NormalInput label={'User name'} name='user_name' id='user-name'
//                   onChangeFun={handleChange} value={form?.user_name} type={'text'} />
//                 : <MobileInput onChangeFun={handleMobileNumber} name='primary_number'
//                   value={`${form?.primary_number?.country_code}${form?.primary_number?.number}`}
//                   label='Primary number' onlyCountries={['in']} />}

//               <NormalInput label={'Password'} name='password' id='password' rightIcon={show ? <RxEyeOpen /> : <RxEyeClosed />}
//                 onChangeFun={handleChange} value={form?.password} type={show ? 'text' : 'password'} rightIconAction={() => setShow(!show)} />

//               <SingleButton type={'submit'} name={'Sign In'} classNames={'lg btn-tertiary txt-center'}
//                 style={{ width: '100%' }} loading={isLoading} />

//               {!admin && <>

//                 <div className="forgot-option">
//                   <p onClick={() => navigate('/auth/forgot-password')}>Forgot Password ?</p>
//                 </div>

//                 <div className="description">
//                   <p>The Staff Account Login system provides secure access through a mobile number
//                     and password, streamlining authentication and ensuring quick, efficient access
//                     to work-related information.</p>
//                 </div>
//               </>}

//             </form>
//           </div>
//         </div>

//       </div>

//     </div>
//   )
// }

// export default Login
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'; import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoader } from '../store/slices/loader.slice';

const Login = () => {
  const [loginSignup, setLoginSignup] = useState(true)
  const [typeInput, setTypeInput] = useState('password')
  const [visibility, setVisibility] = useState('visibility')
  const { register, handleSubmit, reset } = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  dispatch(setLoader(false))
  const login = window.localStorage.getItem('token')
  const fisrtName = window.localStorage.getItem('firstName')
  const lastName = window.localStorage.getItem('lastName')


  const resetData = () => {
    reset()
  }

  const submit = userData => {
    axios.post('https://e-commerce-api.academlo.tech/api/v1/users/login', userData)
      .then(res => {
        window.localStorage.setItem('token', res.data.data.token)
        window.localStorage.setItem('firstName', res.data.data.user.firstName)
        window.localStorage.setItem('lastName', res.data.data.user.lastName)
        resetData()
        dispatch(setTitleModal('Successful login'))
        dispatch(setHandleShow(true))
        navigate('/')
      })
      .catch(error => {
        if (error.response?.status === 404) {
          alert(error.response.data.message)
        }
        console.log(error.response)
      })
  }

  const userRegister = newUser => {
    axios.post('https://e-commerce-api.academlo.tech/api/v1/users', newUser)
      .then(() => {
        alert('User Register')
        resetData()
      })
      .catch(error => console.log(error))
  }

  const changeSection = () => {
    setLoginSignup(!loginSignup)
  }

  const isVisible = () => {
    if (typeInput === 'password' && visibility === 'visibility') {
      setTypeInput('text')
      setVisibility('visibility_off')
    } else {
      setTypeInput('password')
      setVisibility('visibility')
    }
  }

  const logout = () => {
    window.localStorage.setItem('token', '')
    window.location.reload()
}


  return (
    <>
      {
        login ? (
          <div className='login-successful'>
            <h4>Hi! {fisrtName} {lastName} welcome</h4>
            <a href="#" onClick={logout}>Log out</a>
          </div>
        ) : (
          <div className='form-container'>
            {
              loginSignup ? (
                <form onSubmit={handleSubmit(submit)}>
                  <h2>Welcome! enter you email and password to continue</h2>
                  <article className='test-data'>
                    <b>Test data</b>
                    <p>john@gmail.com</p>
                    <p>john1234</p>
                  </article>
                  <input type='email' placeholder='Email' {...register('email')} />
                  <div className='input-password'>
                    <input type={typeInput} placeholder='Password' {...register('password')} />
                    <span onClick={() => isVisible()} className='material-symbols-outlined is-visible'>{visibility}</span>
                  </div>
                  <button>Login</button>
                  <p>Don't have an account? <span onClick={() => changeSection()}>Sign up</span></p>
                </form>
              ) : (
                <form onSubmit={handleSubmit(userRegister)}>
                  <h2>Sign up</h2>
                  <input type='email' placeholder='Email' {...register('email')} />
                  <input type='text' placeholder='Fisrt Name' {...register('firstName')} />
                  <input type='text' placeholder='Last Name' {...register('lastName')} />
                  <div className='input-password'>
                    <input type={typeInput} placeholder='Password' {...register('password')} />
                    <span onClick={() => isVisible()} className='material-symbols-outlined is-visible'>{visibility}</span>
                  </div>
                  <input type='text' placeholder='Phone Number' {...register('phone')} />
                  <button>Sign up</button>
                  <p>Already have an account? <span onClick={() => changeSection()}>Login</span></p>
                </form>
              )
            }
          </div>
        )
      }
    </>
  );
};

export default Login;

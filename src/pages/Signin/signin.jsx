import React from 'react'
import './signin.css'
const signin = () => {
  return (
   <div className='main'>
    {/* From Uiverse.io by ammarsaa */} 
      <form className="form">
          <p className="title">Register </p>
          <p className="message">Signup now and get full access to our app. </p>
              <div className="flex">
              <label>
                  <input className="input" type="text" placeholder="" required />
                  <span>Firstname</span>
              </label>

              <label>
                  <input className="input" type="text" placeholder="" required />
                  <span>Lastname</span>
              </label>
          </div>  
                  
          <label>
              <input className="input" type="email" placeholder="" required />
              <span>Email</span>
          </label> 
              
          <label>
              <input className="input" type="password" placeholder="" required />
              <span>Password</span>
          </label>
          <label>
              <input className="input" type="password" placeholder="" required />
              <span>Confirm password</span>
          </label>
          <button class="submit">Submit</button>
          <p class="signin">Already have an acount ? <a href="#">Signin</a> </p>
      </form>
   </div>
  )
}

export default signin

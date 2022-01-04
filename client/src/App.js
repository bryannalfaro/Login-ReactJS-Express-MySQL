import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./App.css";


function App() {


	const [usernameReg,setUsernameReg] = useState('')
	const [passwordReg,setPasswordReg] = useState('')
	const [username,setUsername] = useState('')
	const [password,setPassword] = useState('')
	const [loginStatus,setLoginStatus] = useState('')

	Axios.defaults.withCredentials = true;

	const register = () =>{
		Axios.post('http://localhost:3001/register',{
			name:usernameReg,
			password:passwordReg
		})
		.then(res =>{
			setUsernameReg('')
			setPasswordReg('')
		})
		.catch(err =>{
			console.log(err)
		})
	}

	const login = () =>{
		Axios.post('http://localhost:3001/login',{
			name:username,
			password:password
		})
		.then(res =>{
			if(res.data.message){
				setLoginStatus(res.data.message)
			}else{
				setLoginStatus(res.data[0].name)
			}

			setUsername('')
			setPassword('')
		})
		.catch(err =>{
			console.log(err)
		})
	}

	//request if the user session  exists
	useEffect(() => {
		Axios.get('http://localhost:3001/login').then(res => {
			if(res.data.loggedIn === true){
			setLoginStatus(res.data.user[0].name);
			}
		})
	},[]);



  return (
    <div className="App">
		<div className="registration">
		  <h1>Registration</h1>
		  <label>Username</label>
		  <input type="text" value={usernameReg} onChange={(e) => setUsernameReg(e.target.value)}/>
		  <label>Password</label>
		  <input type="password" value={passwordReg} onChange={(e) => setPasswordReg(e.target.value)}/>
		  <button onClick ={register}> Register </button>
		</div>

		<div className="login">
		  <h1>Login</h1>
		  <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
		  <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
		  <button onClick={login}> Login </button>

		  <h1>{loginStatus}</h1>
		</div>
	</div>


  );
}

export default App;

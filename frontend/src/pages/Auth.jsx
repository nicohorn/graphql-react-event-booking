import React, { Component } from 'react';
import AuthContext from '../context/auth-context'

class AuthPage extends Component {
    state = {
        isLogin: true,
        passwordMatch: false,
        selectedFile: null
    };

    static contextType = AuthContext;

    constructor(props){
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
        this.passwordEl2 = React.createRef();
        this.nameEl = React.createRef();
        this.lastNameEl = React.createRef();
        this.dniEl = React.createRef();
        this.birthdayEl = React.createRef();
    }

    profilePictureHandler = event => {
      event.preventDefault();
      this.setState({selectedFile: event.target.files[0]})
    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin}
        })
    }
    submitHandler = (event) =>{
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value; 
        let password2;
        //let image;
        let profileName;
        let profileLastName;
        let dni;
        let birthday;
        let userId;
  

        if(!this.state.isLogin){
           password2 = this.passwordEl2.current.value;
           //image = this.state.selectedFile.name;
           profileName = this.nameEl.current.value;
           profileLastName = this.lastNameEl.current.value;
           dni = this.dniEl.current.value;
           birthday = this.birthdayEl.current.value
        }

        if(password === password2){
          this.setState(prevState => {
            return {passwordMatch: !prevState.passwordMatch}
        })
        }

        if(email.trim().length === 0 || password.trim().length === 0){
            return;
        }

        if(this.state.isLogin){
          let requestBody = {
            query: `
                query{
                    login(email: "${email}", password: "${password}"){
                        userId
                        token
                        tokenExpiration
                        isAdmin
                        profile{
                          name
                          lastname
                        }
                    }
                }
            `
        }

        fetch("http://localhost:3000/graphql", {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error("Failed!");
            }
            return res.json();
          })
          .then(resData =>{
              if(!this.state.isLogin){
                console.log("resData createUser", resData)
                return(console.log("User created"))
              }
              if(resData.data.login.token){
                console.log("resData login ", resData)
                
                  this.context.login(
                    resData.data.login.token,
                    resData.data.login.userId,
                    resData.data.login.isAdmin,
                    resData.data.login.tokenExpiration,
                    resData.data.login.profile.name,
                    resData.data.login.profile.lastname
                    
                  );
                  
              }
 
          })
          .catch((err) => {
            console.log(err);
          });
        }
        
        

        
        if(!this.state.isLogin){
          if(password !== password2){
             return           
          }
  
            let requestBody = {
                query: `
                    mutation{
                        createUser(userInput: {email: "${email}", password: "${password}", isAdmin: false}){
                            _id
                            email
                            isAdmin
                            profile{
                              name
                              lastname
                            }
                        }
                    }
                `
            };

          

          fetch("http://localhost:3000/graphql", {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error("Failed!");
            }
            return res.json();
          })
          .then(resData =>{
        
                console.log("resData createUser", resData)
                userId = resData.data.createUser._id
                console.log("ID DE USUARIO CREADO", resData.data.createUser._id)
                let requestBody2 = {
                  query: `
                      mutation{
                          createProfile(profileInput: {name: "${profileName}", lastname: "${profileLastName}", dni: ${dni}, birthday: "${birthday}", userId: "${userId}"}){
                              _id
                              name
                              lastname
                              user{
                                email
                              }
                          }
                      }
                  `
              };
      
                fetch("http://localhost:3000/graphql", {
                method: "POST",
                body: JSON.stringify(requestBody2),
                headers: {
                  "Content-Type": "application/json",
                },
              })
                return(console.log("User created"))     
 
          })
          .catch((err) => {
            console.log(err);
          });

          
        } 
      
    }

    

    render() {
      return (
        <div className="flex justify-center">
          <form className="form-control flex" onSubmit={this.submitHandler}>
            {this.state.isLogin && (
              <div>
                <div className="form-control mb-2">
                  <label className="label" htmlFor="email">
                    E-Mail
                  </label>
                  <input
                    className="input input-bordered"
                    type="email"
                    id="email"
                    ref={this.emailEl}
                  />
                </div>
                <div className="form-control mb-2">
                  <label className="label" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="input input-bordered"
                    type="password"
                    id="password"
                    ref={this.passwordEl}
                  />
                </div>
              </div>
            )}
            {!this.state.isLogin && (
              <React.Fragment>
              <div className="flex gap-4">
                <div>
                  <div className="form-control mb-2">
                    <label className="label" htmlFor="email">
                      E-Mail
                    </label>
                    <input
                      className="input input-bordered"
                      type="email"
                      id="email"
                      ref={this.emailEl}
                    />
                  </div>
                  <div className="form-control mb-2">
                    <label className="label" htmlFor="password">
                      Password
                    </label>
                    <input
                      className="input input-bordered"
                      type="password"
                      id="password"
                      ref={this.passwordEl}
                    />
                  </div>
                  <div className="form-control mb-2">
                    <label className="label" htmlFor="password">
                      Enter Password again
                    </label>
                    <input
                      className="input input-bordered"
                      type="password"
                      id="password"
                      ref={this.passwordEl2}
                    />
                    <h3 className="text-2xs">
                      {!this.state.passwordMatch
                        ? "Passwords don't match"
                        : "Passwords match!"}
                    </h3>
                  </div>
                </div>
                <div>
                  <div className="form-control mb-2">
                    <label className="label" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="input input-bordered"
                      type="text"
                      id="name"
                      ref={this.nameEl}
                    />
                  </div>
                  <div className="form-control mb-2">
                    <label className="label" htmlFor="lastname">
                      Last Name
                    </label>
                    <input
                      className="input input-bordered"
                      type="text"
                      id="lastname"
                      ref={this.lastNameEl}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label" htmlFor="dni">
                      DNI
                    </label>
                    <input
                      className="input input-bordered"
                      type="number"
                      id="dni"
                      ref={this.dniEl}
                    />
                  </div>
                </div>
              </div>
              <label className="label" htmlFor="datetime">
              Birthday
            </label>
            <input
              className="input input-bordered white"
              type="date"
              id="dni"
              ref={this.birthdayEl}
            />
            <label
                      className="
                                w-100
                                mb-3
                                mt-3
                                flex flex-col
                                items-center
                                px-4
                                py-6
                                btn
                                btn-primary
        
                                "
                    >
                      <span className="label">
                        Profile picture
                      </span>
                      <input type="file" class="hidden" onChange={this.profilePictureHandler}/>
                    </label>
            </React.Fragment>
            )}
            <div className="form-actions">
              <button
                className="btn btn-primary mt-2 mr-2"
                type="submit"
                onClick={this.submitHandler}
              >
                Submit
              </button>

              <button
                className="btn btn-outline btn-primary"
                type="button"
                onClick={this.switchModeHandler}
              >
                Switch to {this.state.isLogin ? "Signup" : "Login"}
              </button>
            </div>
          </form>
        </div>
      );
    }
}

export default AuthPage;
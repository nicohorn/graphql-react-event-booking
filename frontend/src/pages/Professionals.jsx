import React, { Component } from 'react';
import Modal from '../components/modal/modal'
import AuthContext from '../context/auth-context'
import ProfessionalList from '../components/professionals/professionalsList/professionalsList'
import axios from 'axios';


class ProfessionalsPage extends Component {
  state={
    //this creating state is for the backdrop that got removed because Daisy UI takes care of the backdrop when implementing its modal.
    creating: false,
    professionals: [],
    isLoading: false,
    selectedProfessional: null,
    viewDetail: false,
    selectedFile: null
  }

  static contextType = AuthContext;

  constructor(props){
    super(props);
    this.nameElRef = React.createRef();
    this.lastnameElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.startDateElRef = React.createRef();
    this.startTimeMorningElRef = React.createRef();
    this.endTimeMorningElRef = React.createRef();
    this.startTimeAfternoonElRef = React.createRef();
    this.endTimeAfternoonElRef = React.createRef();

  }


 //Life cycle hook, it executes when the component is added to the DOM tree.
  componentDidMount(){
    this.fetchProfessionals();
  }

  startCreateProfessionalHandler = () =>{
    this.setState({creating:true});
  }

  profilePictureHandler = event => {
    event.preventDefault();
    this.setState({selectedFile: event.target.files[0]})
  }


  modalConfirmHandler = () =>{
    this.setState({ creating: false });
    const name = this.nameElRef.current.value;
    const lastname = this.lastnameElRef.current.value;
    const price = +this.priceElRef.current.value;
    const image = this.state.selectedFile.name;
    const startTimeMorning = this.startTimeMorningElRef.current.value;
    const endTimeMorning = this.endTimeMorningElRef.current.value;
    const startTimeAfternoon = this.startTimeAfternoonElRef.current.value;
    const endTimeAfternoon = this.endTimeAfternoonElRef.current.value;
    

    const professional = { name: name, lastname: lastname, price: price, image: image };

    console.log(this.state.selectedFile);
      
      const fd = new FormData();
      fd.append("image", this.state.selectedFile, this.state.selectedFile.name);
      console.log(fd);
      axios
        .post(
          "https://us-central1-origen-967ef.cloudfunctions.net/uploadFile",
          fd
        )
        .then((res) => {
          if(res.status === 200){            
            if (
              name.trim().length === 0 ||
              lastname.trim().length === 0 ||
              price <= 0
            ) {
              return;
            }
            const requestBody = {
              query: `
                mutation{
                  createProfessional(professionalInput: {name: "${name}", lastname: "${lastname}", price: ${price}, image: "${res.data.imageUrl}", startTimeMorning: "${startTimeMorning}", endTimeMorning:"${endTimeMorning}", startTimeAfternoon: "${startTimeAfternoon}", endTimeAfternoon: "${endTimeAfternoon}"}){
                    _id
                    name
                    lastname
                    price
                    image
                  }
                }
              `,
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
                  throw new Error("Failed to create new professional");
                }
                return res.json();
              })
              .then(() => {
                this.fetchProfessionals();
              })
              .catch((err) => {
                console.log(err);
              });
              console.log(professional);
          }
        });

    

    
  }

  modalCancelHandler = () =>{
    this.setState({creating: false, selectedProfessional: null, viewDetail: false});
  }

  fetchProfessionals(){
    const requestBody = {
      query: `
        query{
          professionals{
            _id
            name
            lastname
            price
            image
            startTimeMorning
            endTimeMorning
            startTimeAfternoon
            endTimeAfternoon
          }
        }
      `
    }

    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res=>{
      if(res.status !== 200 && res.status !== 201){
        throw new Error('Failed to fetch professionals')
      }
      return res.json();
    }).then(resData =>{
      const professionals = resData.data.professionals;
      this.setState({professionals:professionals});
    }).catch(err => {
      console.log(err)
    })
  }

  showDetailHandler = professionalId =>{
    this.setState(prevState =>{
      const selectedProfessional = prevState.professionals.find(p=>p._id === professionalId)
      return {selectedProfessional: selectedProfessional, viewDetail: true}
    })
  }

  showBookAppointmentHandler = professionalId =>{
    this.setState(prevState =>{
      const selectedProfessional = prevState.professionals.find(p=>p._id === professionalId)
      return {selectedProfessional: selectedProfessional}
    })
  }

  bookAppointmentHandler = () =>{
    const startDate = this.startDateElRef.current.value
    const requestBody = {
      query: `
        mutation{
          bookAppointment(bookAppointmentInput: {professionalId: "${this.state.selectedProfessional._id}", startDate: "${startDate}"}){
            _id
            professional{
              name
              lastname
            }
            user{
              email
            }
          }
        }`
    }

    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.context.token
      }
    }).then(res=>{
      if(res.status !== 200 && res.status !== 201){
        throw new Error('Failed to create new appointment')
      }
      return res.json();
    }).then(resData =>{
      console.log(resData)

      this.setState({creating: false, selectedProfessional: null, viewDetail: false});
    }).catch(err => {
      console.log(err)
    })
  }

  

    render() {
        return (
          <React.Fragment>
            {this.state.creating && (
              <Modal
                title="Add professional"
                canCancel
                canConfirm
                cancelText = "Cancel"
                confirmText="Confirm"
                onCancel={this.modalCancelHandler}
                onConfirm={this.modalConfirmHandler}
              >
                <form>
                  <div className="form-control">
                    <label className="label" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="input input-bordered"
                      type="text"
                      id="name"
                      ref={this.nameElRef}
                    />
                    <label className="label " htmlFor="lastname">
                      Last name
                    </label>
                    <input
                      className="input input-bordered"
                      type="text"
                      id="lastname"
                      ref={this.lastnameElRef}
                    />
                    <label className="label" htmlFor="price">
                      Price
                    </label>
                    <input
                      className="input input-bordered"
                      type="number"
                      id="price"
                      ref={this.priceElRef}
                    />

                    <label className="label" htmlFor="time">
                      Start time morning
                    </label>
                    <input
                      className="input input-bordered"
                      type="time"
                      id="startTimeMorning"
                      ref={this.startTimeMorningElRef}
                    />

                    <label className="label" htmlFor="time">
                    End time morning
                    </label>
                    <input
                      className="input input-bordered"
                      type="time"
                      id="endTimeMorning"
                      ref={this.endTimeMorningElRef}
                    />
                    <label className="label" htmlFor="time">
                      Start time afternoon
                    </label>
                    <input
                      className="input input-bordered"
                      type="time"
                      id="startTimeAfternoon"
                      ref={this.startTimeAfternoonElRef}
                    />
                    <label className="label" htmlFor="time">
                      End time afternoon
                    </label>
                    <input
                      className="input input-bordered"
                      type="time"
                      id="endTimeAfternoon"
                      ref={this.endTimeAfternoonElRef}
                    />

                    <label
                      className="
                                w-100
                                mt-4
                                flex flex-col
                                items-center
                                px-4
                                py-6
                                btn
                                btn-outline
                                "
                    >
                      <span className="label">
                        Profile picture
                      </span>
                      <input type="file" class="hidden" onChange={this.profilePictureHandler}/>
                    </label>
                  </div>
                </form>
              </Modal>
            )}
            {this.state.selectedProfessional && this.state.viewDetail && (
              <Modal
                title={this.state.selectedProfessional.name}
                canCancel
                cancelText = "Return"
                onCancel={this.modalCancelHandler}
              >
                <h1 className="font-bold text-xl mb-3">
                  {this.state.selectedProfessional.name}{" "}
                  {this.state.selectedProfessional.lastname}
                </h1>
                <p>Mornings from {this.state.selectedProfessional.startTimeMorning} to {this.state.selectedProfessional.endTimeMorning}</p>
                <p>Afternoons from {this.state.selectedProfessional.startTimeAfternoon} to {this.state.selectedProfessional.endTimeAfternoon}</p>
                <h1 className='mt-2'>
                  Hourly rate: <span className="font-bold ">${this.state.selectedProfessional.price}</span> 
                </h1>
                <h1>Specialized in family therapy</h1>
              </Modal>
            )}

            {this.state.selectedProfessional && !this.state.viewDetail && (
              <Modal
                title={this.state.selectedProfessional.name}
                canConfirm
                canCancel
                cancelText = "Cancel"
                confirmText="Book appointment"
                onCancel={this.modalCancelHandler}
                onConfirm={this.bookAppointmentHandler}
              >
                <h1 className="font-bold ">
                  {this.state.selectedProfessional.name}{" "}
                  {this.state.selectedProfessional.lastname}
                  
                </h1>
                <h1 > Price: <span className="font-bold ">${this.state.selectedProfessional.price}</span>
                  
                </h1>
                <label className="label " htmlFor="price">
                  Date and time of the appointment
                </label>
                <input
                  className="input input-bordered"
                  type="datetime-local"
                  id="startDate"
                  ref={this.startDateElRef}
                />
              </Modal>
            )}

            <div className="container mx-auto px-8">
              {this.context.isAdmin && (
                <button
                  className="btn mt-2 mb-4"
                  onClick={this.startCreateProfessionalHandler}
                >
                  Create Professional
                </button>
              )}

                <ProfessionalList
                  professionals={this.state.professionals}
                  authUserId={this.context.userId}
                  onViewDetail={this.showDetailHandler}
                  bookAppointment={this.showBookAppointmentHandler}
                />


            </div>
          </React.Fragment>
        );
    }
}

export default ProfessionalsPage;
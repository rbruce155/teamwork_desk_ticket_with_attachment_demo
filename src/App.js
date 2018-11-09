import React, { Component } from 'react';
import axios, { post } from 'axios';
import './App.css';

class App extends Component {

  constructor(props) {
      super(props);
      this.state ={
        file:null,
        twKey:''
      }
      this.onFormSubmit = this.onFormSubmit.bind(this)
      this.onChange = this.onChange.bind(this)
      this.onChangeAPI = this.onChangeAPI.bind(this)
      this.fileUpload = this.fileUpload.bind(this)
    }
    onFormSubmit(e){
      e.preventDefault() // Stop form submit
      this.fileUpload(this.state.file).then((response)=>{
        console.log(response.data);
        if (response.data) {
          console.log('create ticket');
          console.log(response.data.attachment.id);
          this.createTicket(response.data.attachment.id).then((response)=>{
            console.log(response.data);
          })
        }
      })
    }

    onChange(e) {
      this.setState({file:e.target.files[0]})
    }

    onChangeAPI(e) {
      console.log(e.target.value);
      const val = e.target.value;
      this.setState({twKey: val})
    }

    fileUpload(file){
      const url = 'https://clas.teamwork.com/desk/v1/upload/attachment';
      const formData = new FormData();
      formData.append('file',file)
      const config = {
          headers: {
              'content-type': 'multipart/form-data'
          },
          auth: {
            username: this.state.twKey,
            password: ''
          },
      }
      return  post(url, formData,config)
    }

    createTicket(attachmentId){
      return axios.post('https://clas.teamwork.com/desk/v1/tickets.json', {
        "inboxId": 1892,
        "source": "support api form",
        "customerEmail": "rbruce2@asu.edu",
        "customerFirstName": "Robert",
        "customerLastName": "Bruce",
        "customerPhoneNumber": "480-645-4588",
        "subject": "test ticket",
        "message": "<div>hello from teamwork-attachment app</div>",
        "notifyCustomer": false,
        "editMethod": "html",
        "attachmentIds": [ attachmentId ]
      }, {
        auth: {
          username: this.state.twKey,
          password: ''
        }
      })
    }

    render() {
      return (
        <div className="App">
          <header className="App-header">
            <form onSubmit={this.onFormSubmit}>
              <h1>Teamwork Desk API Key</h1>
              <input type="text" onChange={this.onChangeAPI} />
              <h1>File Upload</h1>
              <input type="file" onChange={this.onChange} />
              <button type="submit">Upload</button>
            </form>
          </header>
        </div>
     )
    }
}

export default App;

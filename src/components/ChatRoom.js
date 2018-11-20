import React ,{ Component} from 'react';
import { Button,FormGroup } from 'reactstrap';

class ChatRoom extends Component
{
    constructor(props,context)
    {
        super(props,context)
        this.updateMessage = this.updateMessage.bind(this);
        this.submitMessage = this.submitMessage.bind(this);
        this.setData = this.setData.bind(this);
        this.putData = this.putData.bind(this);
        this.state={
            message:'',
            messages:[],
            username:localStorage.getItem("username")?localStorage.getItem("username"):'',
            startChat:localStorage.getItem("username")?true:false

        }

    }
    componentDidMount()
    { 
        console.log("componentDIdmount")
        firebase.database().ref('messages/').on('value', (snpashot)=>{
        const currentMessages=snpashot.val();
        if (currentMessages != null){
            this.setState({
                messages:currentMessages
            })
        }
    })
    }
    setData(event)
    {
            console.log("setdata:"+event.target.value);
            this.setState({
                username:event.target.value
            })
    }
    putData()
    {
         if(this.state.username){
            localStorage.setItem("username",this.state.username);
            this.setState({startChat :true});
         }
         
         
    }

    updateMessage(event){
        console.log("updateMessage:"+event.target.value);
        this.setState({
            message:event.target.value
        })
    }
    submitMessage(event){
        if(event.keyCode ==13 && this.state.message!==""){
        console.log("submitmessage:"+this.state.message);
        const nextMessage = {
            id:this.state.messages.length,
            text:this.state.message,
            username:localStorage.getItem("username")
        }
        firebase.database().ref('messages/'+nextMessage.id).set(nextMessage)
        /*var list = Object.assign([],this.state.messages);
        list.push(nextMessage);
        this.setState({
            messages:list
        })*/
        event.target.value="";
    }
    } 
 render()
 {
    const currentMessage = this.state.messages.map((message,i)=>
    {
        return (
            <div>
                
                   {message.username === this.state.username && <li key={message.id} class="list-group-item" id="item1" class="list-group-item list-group-item-success">{message.text}</li>}
                   {message.username !== this.state.username && <li key={message.id} class="list-group-item" style={{marginLeft:40,marginTop:10,width:600}} class="list-group-item list-group-item-info">{message.text}</li>}
                
            </div>
        )
    })
     return(
       <div> 
            <div>
               <h2 id="heading" >Innomick ChatApp</h2>
                { !this.state.startChat &&
                  <div> 
                      <center>
                       <input type="text" class="form-control form-rounded" style={{marginTop:"20px",width:250,borderRadius:25}} onChange={this.setData} placeholder="enter your name"/><br/>
                       <Button onClick={this.putData} color="info">start chat</Button>
                       </center>
                  </div>               
                }
                { this.state.startChat && <div>
                  <ol class="list-group">
                   {currentMessage}
                  </ol>
                  <br/>
                  <FormGroup>
                    <input type="text" class="form-control form-rounded" style={{height:50,width:600,marginLeft:650,marginTop:450,borderRadius:25}} onChange={this.updateMessage} onKeyDown={this.submitMessage} placeholder="write your message,then hit enter"/>
                  </FormGroup>
                  </div>
                }
            </div>
       </div>
     );
 }
 }
export default ChatRoom;
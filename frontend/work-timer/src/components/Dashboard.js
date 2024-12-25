import { useEffect, useState } from "react"
function Dashboard({user,setUser}){
    const [currentTime,setCurrentTime]=useState(null)
    const [message,setMessage]=useState('')
    const handleTimeRecord=async(type)=>{
        try{
            const res= await fetch('http://localhost:3001/api/time-record',{
                method:'POST',
                headers:{
                    'Content-type':'application/json'
                },
                body:JSON.stringify({
                    username:user.username,
                    type:type
                }
                )
             }
            );
            if(!res.ok){
                throw new Error(`HTTP error! status: ${res.status}`)
            }
            setMessage(`Successfully recorded ${type}`);
            setTimeout(() => setMessage(''), 3000);

        }
        catch(err){
            console.error('Error:', err);
            setMessage('Failed to record time');
            setTimeout(() => setMessage(''), 3000);
          }
    }
       
    
    useEffect(() => {
        const fetchTime= async()=>{
            try{
                const res=await fetch('http://localhost:3001/api/current-time')
                const data=await res.json();
                const time=new Date(data.currentTime);
                setCurrentTime(time);

            }
            catch(err){
                console.error('Error fetching time:', err);
            }
        }
        fetchTime();
        const serverInterval= setInterval(fetchTime,60000)
        const localInterval= setInterval(()=>{
            setCurrentTime(prevTime=>{
                if(prevTime){
                    return new Date(prevTime.getTime() +1000)
                }
                return prevTime
            })
        },1000);
        return ()=>{
            clearInterval(serverInterval)
            clearInterval(localInterval)
        }
    },[])

    return (
        <div>
            <h1>Welcome! {user.username}</h1>            
            <div>
                <h2>Current Time in Germany</h2>
                <p>{currentTime? currentTime.toLocaleString():'Loading ...'}</p>
            </div>
            <div>
                <button onClick={()=>handleTimeRecord('entry')}>Entry</button>
                <button onClick={()=>handleTimeRecord('exit')}>Exit</button>    
            </div>
            {message&& <p>{message}</p>}
            <button onClick={()=>setUser(null)}>Logout</button>
        </div>
    );}
    export default Dashboard
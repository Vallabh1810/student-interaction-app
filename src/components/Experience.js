import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ProfileNavbar from './ProfileNavbar';
import Card from '../components/Card'
import Footer from '../components/Footer';

export default function Experience() {
    let navigate=useNavigate();
    const [Experiencesearch,setExperienceSearch]=useState("");
    const [userSkills,setUserSkills]=useState(null);
    let [experiences,setExperiences]=useState([])
    let email=localStorage.getItem("userEmail")
    if(localStorage.getItem("isProfile")==="true"){email=localStorage.getItem("profileEmail")}

    const fetchExperience = async () => {
    await fetch("http://localhost:4000/api/userExperiences", {
        // credentials: 'include',
        // Origin:"http://localhost:3000/login",
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            email:email
        })
    }).then(async (res) => {
        let response= await res.json()
        setExperiences([response])
    })}
    //console.log(experiences)
    const fetchUserSkills= async () => {
      await fetch("http://localhost:4000/api/getUserSkills", {
          // credentials: 'include',
          // Origin:"http://localhost:3000/login",
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body:JSON.stringify({
              email:email
          })
      }).then(async (res) => {
          let response= await res.json()
          setUserSkills(response);
      })}
    
    useEffect(() => {
      fetchExperience ();
      fetchUserSkills();
    }, [])
   //console.log(userSkills)
  return (
    <div>
      <div><ProfileNavbar /></div>
      {localStorage.getItem('userEmail')===email?
      <div className='justify-center ms-2 m-3'>
        <button className={'btn btn-success justify-center ms-2 m-3 t-inline'} onClick={()=>{navigate('/ExperienceUpdate')}}>Clice Here to Add Experience or Skills</button>
      </div>
      :""}
      {userSkills!==null?
      <div className=' container justify-center m-3' >
        {console.log(userSkills)}
      <h5>My Skills</h5>
      <ol>
        <p>{userSkills.SkillData.skill1}</p>
        <p>{userSkills.SkillData.skill2}</p>
        <p>{userSkills.SkillData.skill3}</p>
        <p>{userSkills.SkillData.skill4}</p>
        <p>{userSkills.SkillData.skill5}</p>
      </ol>
      </div>:
      <div className=' container m-3 justify-center'>
        <h5 className='m-3'>My Skills</h5>
        Not Added</div>}
      
      <br/>
      <h5 className='m-3 justify-content-center' style={{color:"text-primary"}}>My Experiences</h5>
    
      <div className="d-flex m-3 justify-content-center ">
          <button className="btn btn-outline-success text-white bg-success" style={{'margin-right': '10px'}} >Search</button>
          <input className="form-control " type="search" placeholder="Search"  aria-label="Search" value={Experiencesearch} onChange={(e)=>{setExperienceSearch(e.target.value)}} />
      </div>
  
      <div className='container'>
          {
            experiences[0]!==null
            ? experiences.map((data)=>{
              return(
                 <div className='row mb-2'>
                  {(data.experience !== [] && data.email==email)
                    ?data.experience.filter((item)=> (String(item[1].name).toLowerCase().includes(String(Experiencesearch).toLowerCase())))
                    .map(userSkills=>{ 
                      return(
                        <div key={userSkills._id} className='col-9 col-md-6 col-lg-3 mt-1' >
                          <Card 
                            date={userSkills[0].Order_date
                            }
                            email={data.email}
                            message={localStorage.getItem("userEmail").concat(" ","wants to talk with you about your interview experience")}
                            name={userSkills[1].user}
                            company={userSkills[1].name}
                            experience={userSkills[1].experience}
                          />
                        </div>
                      )
                    }
                    ):""
                  }
                 </div>
              )
            })
            :<div>
              <br/><br/>
            "You Have Not Shared Any Of Your Experiences"
            <br/><br/><br/>
            </div>
          }
      </div>
      
      <div><Footer /></div>
    </div>  
    
  )
}

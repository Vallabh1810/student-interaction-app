import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
export default function Experiences() {
  const [search,setSearch]=useState("");
  let [experience,setExperience]=useState([])
    const fetchUser = async () => {
        await fetch("http://localhost:4000/api/getExperiences", {
            // credentials: 'include',
            // Origin:"http://localhost:3000/login",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (res) => {
            let response= await res.json()
            await setExperience(response)
        })}
        
        useEffect(() => {
            fetchUser()
        }, [])
  console.log(experience)
  return (
    <div>
      <div><Navbar /></div>
      <div className="d-flex m-3 justify-content-center ">
          <button className="btn btn-outline-success text-white bg-success" style={{'margin-right': '10px'}} >Search</button>
          <input className="form-control " type="search" placeholder="Search"  aria-label="Search" value={search} onChange={(e)=>{setSearch(e.target.value)}} />
      </div>
      <div className='container card-group'>
          {
            experience!==[]
            ? experience.map((data)=>{
              return(
                
                 <div className='card-group'>
                  {data.experience !== []
                    ?data.experience.filter((item)=> (String(item[1].name).toLowerCase().includes(String(search).toLowerCase())))
                    .map(filterItems=>{ 
                      return(
                        <div key={filterItems._id} className='m-2' >
                          <Card 
                            date={filterItems[0].Order_date
                            }
                            email={data.email}
                            message={localStorage.getItem("userEmail").concat(" ","wants to talk with you about your interview experience")}
                            name={filterItems[1].user}
                            company={filterItems[1].name}
                            experience={filterItems[1].experience}
                          />
                        </div>
                      )
                    }
                    ): <div>No Such Data Found</div>
                  }
                 </div>
              )
            })
            :<div>No Such Data Found</div>
          }
      </div>
      <div><Footer /></div>
    </div>
  )
}

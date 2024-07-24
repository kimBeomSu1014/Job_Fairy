import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './page/Home/js/Home';
import Mypage from './page/Mypage/js/Mypage';
import LoginPage from './page/Login/js/LoginPage';
import Register from './page/Register/js/Register';
import Self_introduction from './page/Self_introduction/js/Self_introduction';
import AIinterview from './page/AI/js/AIinterview';
import CheckCamMic from './page/AI/Checkcammic/CheckCamMic';
import Recruitment from './page/Recruitment/js/Recruitment';
import JobPostingList from './page/Recruitment/js/JobPostingList';

import Report from './page/Report/js/Report';

function App() {
  // const [selectedJob, setSelectedJob] = useState('');

  // const handleJobSelect = (selectedJob) => {
  //   setSelectedJob(selectedJob);
  // };

  // const [data, setData] = useState({});

  // useEffect(() => {
  //     const fetchData = async () => {
  //         const result = await axios('/api/data');
  //         setData(result.data);
  //     };

  //     fetchData();
  // }, []);
  return (
   <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Mypage' element={<Mypage />} />
          <Route path='/LoginPage' element={<LoginPage />} />

          <Route path='/AIinterview' element={<AIinterview />} />
          <Route path='/CheckCamMic' element={<CheckCamMic />} />

          <Route path='/Self_introduction' element={<Self_introduction />} />

          
          <Route path='/Report' element={<Report />} />

          <Route path='/Recruitment' element={<Recruitment />} />
          <Route path='/Recruitment/JobPostingList' element={<JobPostingList />} />
        </Routes>
    </div> 
  );
}

export default App;
 
 
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';
import { LoginExpErrorToast } from "../../../components/ToastMessage";
import {Box, Typography,Paper,IconButton, Pagination} from "@mui/material"
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import "../css/Custom.css";

const BackendIP = process.env.REACT_APP_EC2_IP;

const Body = () => {
    const [kakaoId, setKakaoId] = useState("");
    const [userdata, setUserData] = useState({
        kakaoId: kakaoId,
        nickname: "",
        military: "",
        position: [],
        location: [],
        salary: [2000, 12000],
    });
    const [jobPostings, setJobPostings] = useState([]); 
    const [totalPages, setTotalPages] = useState(1);    
    const [totalItems, setTotalItems] = useState(0);
    const [scrappedJobs, setScrappedJobs] = useState(jobPostings.map(() => false));

    const navigate = useNavigate();
    const location = useLocation();

    // 쿼리 파라미터에서 페이지 번호 추출
    const query = new URLSearchParams(location.search);
    const currentPage = parseInt(query.get('page')) || 1;  // 쿼리 파라미터가 없으면 1로 설정

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found");
            } else {
                const userData = jwtDecode(token);
                setKakaoId(userData.kakaoId);
            }
        } catch (error) {
            LoginExpErrorToast();
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        }
    }, []); // 빈 배열로 한 번만 실행

    useEffect(() => {
        const fetchUserData = async () => {
            if (kakaoId) { // kakaoId가 설정된 경우에만 요청
                try {
                    const response = await axios.post(`${BackendIP}/api/auth/info`, 
                        { kakaoId }, 
                        { withCredentials: true }
                    );
                    setUserData(response.data);
                } catch (err) {
                    alert("오류 발생: " + err.message);
                }
            }
        };

        const fetchCustomData = async (page) => {
            if(kakaoId&&userdata){
                try{
                    // const response = await axios.post(`http://localhost:5000/api/Recruitment/Custom?page=${page}`, { 
                    const response = await axios.post(`${BackendIP}/api/Recruitment/Custom?page=${page}`, { 
                        jobs : userdata.position,
                        locations : userdata.location,
                        salary : userdata.salary[0]
                    })
                    const data = await response.data
                    setJobPostings(data.jobPostings);
                    setTotalPages(data.totalPages);
                    setTotalItems(data.totalItems);
                } catch(err){
                    alert("오류 발생: " + err.message);
                }
            }
        }

        fetchUserData();
        setTimeout(() => {
            fetchCustomData()
        }, 500);
    }, [kakaoId]); // kakaoId가 변경될 때만 실행

    // 해당 JobPosting의 스크랩 상태를 토글
    const handleScrapClick = (index) => {
        const updatedScraps = [...scrappedJobs];
        updatedScraps[index] = !updatedScraps[index]; // 해당 잡포스팅의 스크랩 상태 토글
        setScrappedJobs(updatedScraps);
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return ''; // timestamp가 없으면 빈 문자열 반환
        const date = new Date(timestamp * 1000); // timestamp는 초 단위이므로 1000을 곱해 밀리초로 변환
        return date.toLocaleDateString(); // YYYY-MM-DD 형식으로 변환
      };

    const formatLocation = (location) => {
        if (!location) return '위치 정보 없음'; 
        // '&gt;'를 '>'로 변환
        const decodedLocation = location.replace(/&gt;/g, '>');
      
        // 두 번째 '>'를 찾아 그 앞까지만 사용
        const firstPart = decodedLocation.split('>').slice(0, 2).join(' ');
      
        // '>'을 공백으로 변환하여 반환
        return firstPart.replace(/>/g, ' ');
      };

    return (
        <div className="Custom_container">
            <div className="Custom_box px-5 py-3">
                <div className="Custom_data">
                    <div className="data_name">
                        <strong>{userdata.nickname}</strong> 님의
                        <span> 맞춤 공고는</span>
                        <br/>총 <strong>{totalItems}</strong> 건입니다.
                    </div>
                    <div className="data_detail">
                        <div className="detail_position">
                            <span>직무:</span> {userdata.position && userdata.position.length > 0 ? userdata.position.join(', ') : '없음'}
                        </div>
                        <div className="detail_location">
                            <span>위치:</span> {userdata.location && userdata.location.length > 0 ? userdata.location.join(', ') : '없음'}
                        </div>
                        <div className="detail_salary">
                            <span>연봉:</span> {userdata.salary[0]} 만원 ~ {userdata.salary[1]} 만원
                        </div>
                    </div>
                </div>
                <div className="Custom_list">
                    <div className="list_box mt-3">
                        {jobPostings?.map((job, index) => (
                            <Paper key={index} elevation={3} sx={{ mb: 2, p: 2 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box sx={{maxWidth:"70%"}} >
                                        <Typography  className="custom_job_company">
                                            <a href={job?.company?.detail?.href || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#1E90FF' }}>
                                                {job?.company?.detail?.name || '회사 이름 없음'}
                                            </a>
                                        </Typography>
                                        <Typography variant="h6" className="custom_job_title" sx={{ fontWeight: 'bold' }}>
                                            <a href={job?.url || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {job?.position?.title || '제목 없음'}
                                            </a>
                                        </Typography>
                                    </Box>
                                    <Box textAlign="right">
                                        {/* 스크랩 아이콘 버튼 */}
                                        <IconButton onClick={() => handleScrapClick(index)} color={scrappedJobs[index] ? "primary" : "default"}>
                                            {scrappedJobs[index] ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                        </IconButton>              
                                        <Typography variant="body2">{formatLocation(job?.position?.location?.name)}</Typography>
                                        <Typography variant="body2">{job?.position?.experience_level?.name || '경력 정보 없음'}</Typography>
                                        <Typography variant="body2">{formatTimestamp(job?.expiration_timestamp)}</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        ))}

                    </div>
                </div>
                <div className="Custom_page">
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                        size="small"
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, value) => {
                        const params = new URLSearchParams(location.search);
                        params.set('page', value);  // 페이지 번호를 쿼리 스트링에 설정
                        navigate(`?${params.toString()}`);
                        }}
                        color="primary"
                    />
                    </Box>        
                </div>
            </div>
        </div>
    );
};

export default Body;
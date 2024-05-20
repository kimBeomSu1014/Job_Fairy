import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, Box, Typography } from '@mui/material';

const positions = [
  '백엔드 개발자', '프론트엔드 개발자', '풀스택 개발자',
  '데브옵스 엔지니어', '데이터 엔지니어', '데이터 사이언티스트',
  'AI 엔지니어', '모바일 앱 개발자', '웹 개발자', '시스템 엔지니어'
];

function PositionSelector() {
  const [open, setOpen] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleButtonClick = (position) => () => {
    const currentIndex = selectedPositions.indexOf(position);
    const newSelected = [...selectedPositions];

    if (currentIndex === -1) {
      newSelected.push(position);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedPositions(newSelected);
  };

  const handleDelete = (positionToDelete) => () => {
    setSelectedPositions((positions) => positions.filter((position) => position !== positionToDelete));
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} sx={{width:"300px"}}>
        희망 직무 선택
      </Button>
      <div>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 2, }}>
        {selectedPositions.map((position) => (
          <Chip
            key={position}
            label={position}
            onDelete={handleDelete(position)}
          />
        ))}
      </Box>
      </ div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>희망 직무 선택</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {positions.map((position) => (
              <Button
                key={position}
                variant={selectedPositions.indexOf(position) !== -1 ? 'contained' : 'outlined'}
                onClick={handleButtonClick(position)}
                sx={{
                  borderRadius: 2,
                  margin: '5px',
                  minWidth: '120px',
                  backgroundColor: selectedPositions.indexOf(position) !== -1 ? '#3493d7' : 'transparent',
                  color: selectedPositions.indexOf(position) !== -1 ? '#fff' : '#3493d7',
                  '&:hover': {
                    backgroundColor: selectedPositions.indexOf(position) !== -1 ? '#297bb0' : '#e3f2fd',
                    color: selectedPositions.indexOf(position) !== -1 ? '#fff' : '#3493d7',
                  },
                }}
              >
                {position}
              </Button>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PositionSelector;
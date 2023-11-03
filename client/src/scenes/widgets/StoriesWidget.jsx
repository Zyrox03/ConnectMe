import React from 'react';
import { Box, Avatar } from '@mui/material';

const storiesData = [
  'user1', 'user2', 'user3', 'user4', 'user5' // Add usernames or image URLs as needed
];

const StoriesWidget = () => {
  return (
    <Box display="flex" alignItems="center"
    sx={{
        margin:'0 0 1em 0',
        justifyContent:'space-between'
    }}
    >
      {storiesData.map((username, index) => (
        <Avatar
          key={index}
          alt={username}
          src={`https://api.freelogodesign.org/assets/blog/thumb/152880db593345cdb307307a5df1c663_1176x840.jpg?t=638315215250000000`} // Replace with your image URLs
          sx={{ width: 50, height: 50, margin: 1, cursor:'pointer',
          border: '2px solid #00D5FA', // Blue border
          borderRadius: '50%' // Circular avatar 
        }}
        />
      ))}
    </Box>
  );
};

export default StoriesWidget;

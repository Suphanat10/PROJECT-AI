import * as React from 'react';
import { colors, Typography } from '@mui/material';

const Reportgraph = () => {

  return (
    <div>
      <Typography variant="h4" sx={{ marginBottom: 2, color: '#689f38' }}>
        Support Vector Regression
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Actual vs. Predicted Traffic Volume (SVR)
      </Typography>
      <img 
        src="https://res.cloudinary.com/dhk2x2azr/image/upload/v1741884836/kzjpvgehbriy1l1dehf1.png" 
        alt="Actual vs. Predicted Traffic Volume (SVR)" 
        style={{ width: '100%', height: 'auto', maxWidth: '600px' }} // Make the image responsive
      />

      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Comparison of Actual vs Predicted Traffic Volume
      </Typography>

      <img 
        src="https://res.cloudinary.com/dhk2x2azr/image/upload/v1741884962/zzy7sd2qyygz0mtlajog.png" 
        alt="Comparison of Actual vs Predicted Traffic Volume" 
        style={{ width: '100%', height: 'auto', maxWidth: '600px' }} // Make the image responsive
      />

      <Typography variant="h4" sx={{ marginBottom: 2, color: '#689f38' }}>
        Neural Network
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Regression Model: Actual vs Predicted
      </Typography>

      <img 
        src="https://res.cloudinary.com/dhk2x2azr/image/upload/v1741881159/rswgwo5cwq4xvehpzir2.png" 
        alt="Regression Model: Actual vs Predicted" 
        style={{ width: '100%', height: 'auto', maxWidth: '600px' }} // Make the image responsive
      />
    </div>
  );
};

export default Reportgraph;

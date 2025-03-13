
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { colors } from '@mui/material';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';


const RepostNN = () => {
   const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function createData(name, calories, fat, carbs, protein, protein10 , protein100) {
   return { name, calories, fat, carbs, protein , protein  , protein10 , protein100 };
 }
 
 const rows = [
   createData('2021-01-01', 'สะพานขาว', 'กรุงเกษม  ', 28.83, 19.31, 17898.0   ,0),
   createData('2021-01-02', 'สะพานขาว', 'หลานหลวง', 28.83, 19.31, 17898.0   ,0),
   createData('2021-01-03', 'ศรีบูรพา - อาคารสงเคราะห์ ', 'ศรีบูรพา', 28.83, 19.31, 17898.0   ,0),
   createData('2021-01-04', 'เลียบคลองภาษีเจริญฝั่งเหนือ - เพชรเกษม 81', 'เพชรเกษม 81 ', 28.83, 19.31, 17898.0   ,0),
 ];
 

  return (
    <div>
       <Typography variant="h5" sx={{ marginBottom: 2 }}>
       แนวทางการพัฒนาการพยากรณ์ปริมาณการจราจร (Traffic Forecasting) 
         </Typography>

         <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography component="span" sx={{ width: '33%', flexShrink: 0, color: '#689f38', fontWeight: 'bold' }}>
          การเตรียมข้อมูล เเละการทำความสะอาดข้อมูล (Data Preparation)
          </Typography>
          <Typography component="span" sx={{ color: 'text.secondary' }}>
          การเตรียมข้อมูลเป็นขั้นตอนสำคัญที่มีผลโดยตรงต่อประสิทธิภาพของโมเดลที่พัฒนา
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
           โหลดชุดข้อมูลและตรวจสอบโครงสร้าง ประกอบด้วย ตัวแปรต่าง ๆ ได้แก่: <br /> ปริมาณการจราจร (Traffic Volume) วันที่ (Date) เวลา (Time) และสภาพอากาศ (Weather Condition) เป็นต้น <br />
          การลบคอลัมน์ที่ไม่จำเป็น การตรวจสอบข้อมูลที่หายไป และการแปลงข้อมูลวันที่เป็นชนิดข้อมูลที่เหมาะสม ใช้ One-Hot Encoding การสร้างฟีเจอร์ใหม่  คำนวณ Total_Vol_Calculated โดยรวมจำนวนยานพาหนะทั้งหมดในช่วงเวลาต่าง ๆ 
        
          
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
         <Typography component="span" sx={{ width: '33%', flexShrink: 0, color: '#689f38', fontWeight: 'bold' }}>
         การเทรนโมเดล (Model Training)
          </Typography>
          <Typography component="span" sx={{ color: 'text.secondary' }}>
            การเทรนโมเดลเป็นขั้นตอนสำคัญที่มีผลโดยตรงต่อประสิทธิภาพของโมเดลที่พัฒนา
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          เลือก Features และ Target ที่เหมาะสม จากนั้นแบ่งข้อมูลเป็นชุด Train และ Test ในสัดส่วน 80:20 เพื่อให้โมเดลสามารถเรียนรู้จากข้อมูลส่วนใหญ่และทดสอบกับข้อมูลที่เหลือได้อย่างเหมาะสม
เพิ่มคุณลักษณะ (Feature Engineering) โดยใช้ PolynomialFeatures เพื่อสร้างฟีเจอร์ที่ไม่เป็นเส้นตรง และปรับขนาดข้อมูล (Feature Scaling) ด้วย MinMaxScaler ให้อยู่ในช่วง [0,1] เพื่อช่วยให้โมเดลเรียนรู้ได้ดีขึ้น
ใช้ Kernel Trick ใน SVR เพื่อแปลงข้อมูลไปยังมิติที่สูงขึ้น ทำให้สามารถจับความสัมพันธ์ที่ซับซ้อนได้ดีขึ้น
เนื่องจาก SVR มีพารามิเตอร์ที่ต้องปรับค่าเพื่อให้ได้ผลลัพธ์ที่ดีที่สุด เราจึงใช้ GridSearchCV เพื่อค้นหาค่าพารามิเตอร์ที่เหมาะสมที่สุดสำหรับโมเดล
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
         <Typography component="span" sx={{ width: '33%', flexShrink: 0, color: '#689f38', fontWeight: 'bold' }}>
          ทฤษฎีของอัลกอริทึมที่พัฒนา
          </Typography>
          <Typography component="span" sx={{ color: 'text.secondary' }}>
            อัลกอริทึมที่ใช้ในการพยากรณ์ปริมาณการจราจร
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Support Vector Regression (SVR) เป็นอัลกอริทึมที่พยายามหาเส้นโค้งที่เหมาะสมสำหรับพยากรณ์ค่าต่อเนื่อง โดยใช้แนวคิดเดียวกับ Support Vector Machine (SVM) 
          ใช้ Kernel Trick เช่น Radial Basis Function (RBF) เพื่อแปลงข้อมูลไปยังมิติที่สูงขึ้น  การใช้ GridSearchCV เพื่อหาพารามิเตอร์ที่ดีที่สุด  มีพารามิเตอร์สำคัญที่ต้องปรับค่า:
C: ค่าควบคุมความเข้มงวดของโมเดล (ค่าใหญ่ขึ้น โมเดลจะพยายาม fit ข้อมูลมากขึ้น)
gamma: กำหนดขอบเขตของ Kernel (ค่ามากขึ้น โมเดลจะซับซ้อนขึ้น)
epsilon: ควบคุมความคลาดเคลื่อนที่ยอมรับได้ในการพยากรณ์
          </Typography>
        </AccordionDetails>
      </Accordion>
     {/* <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        
        <AccordionDetails>
          
        </AccordionDetails>
      </Accordion> */}

      <Typography variant="h5" sx={{ marginBottom: 2 , marginTop: 2 }}>
      การทดสอบและการประเมินผล (Model Evaluation)
         </Typography>

         <Card variant="outlined" sx={{ maxWidth: 360 }}>
  <Box sx={{ p: 2 }}>
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography gutterBottom variant="h5" component="div">
        ผลการทดสอบ Evaluating Regression Model
      </Typography>
    </Stack>

    <Typography variant="body2" >
      ผลการทดสอบ Evaluating Regression Model คือ
    </Typography>

    <Typography variant="body1" >
     (MSE): <strong style={{ color: colors.yellow[900] }}>686.68</strong> <br />
     MSE: <strong style={{ color: colors.red[600] }}>2964455.36</strong> <br />
     RMSE: <strong style={{ color: colors.red[600] }}>1721.76</strong> <br />
      R² Score: <strong style={{ color: colors.green[700] }}>0.99</strong> <br />
    </Typography>
  </Box>
  <Divider />
</Card>

{/* MAE  : 686.68
MSE  : 2964455.36
RMSE : 1721.76
R²   : 0.99 */}
<Typography variant="h5" sx={{ marginBottom: 2 , marginTop: 2 }}>
       ตัวอย่างชุดข้อมูลที่ใช้ในกพัฒนาโมเดล (Dataset)
      </Typography>
      
  
            <Button variant="contained" type="submit"      style={{backgroundColor: '#7cb342', color: 'white' , marginBottom: 2 , marginTop: 2}}>
               ดาวน์โหลดชุดข้อมูล
            </Button>

      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>  Date </TableCell>
            <TableCell align="right">Crossroads</TableCell>
            <TableCell align="right">Road</TableCell>
            <TableCell align="right">Temperature   </TableCell>
            <TableCell align="right"> Rainfall</TableCell>
            <TableCell align="right"> Total_Vol</TableCell>
            <TableCell align="right"> Holiday</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
               <TableCell align="right">{row.protein10}</TableCell>
               <TableCell align="right">{row.protein100}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
</div>
  );
};

export default RepostNN;
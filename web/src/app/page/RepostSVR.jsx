import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { colors } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

const RepostSVR = () => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function createData(
     Date,
      PM2_5,
      PM10,
      CO,
      NO2,
      O3,
      SO2,
      Temperature,
      Humidity,
      Province
  ) {
    return {
      Date,
      PM2_5,
      PM10,
      CO,
      NO2,
      O3,
      SO2,
      Temperature,
      Humidity,
      Province,
    };
  }

  const rows = [
    createData('1/1/2023  3:00:00 AM','119.731','4.50','7.667','15.900','48.694','1.534','21.470','84.576','Hat Yai'),
    createData('1/1/2023  4:00:00 AM','74.90','42.97','-','1.785','7.31','4.812','35.45','58.71','Phuket'),
    createData('1/1/2023  5:00:00 AM','125.302','5.69','8.36','-','35.20','-','22.65','92.2','Chiang Mai'),
    createData('1/1/2023  6:00:00 AM','120.56','5.50','5.667','6.510.900','52.60','-','-','85.20','Bangkok'),
    createData('1/1/2023  7:00:00 AM','130.26','10.26','12.62','20.20','68.694','3.534','21.470','94.576','Khon Kaen'),
  ];

  return (
    <div>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        แนวทางการพัฒนาระบบพยากรณ์คุณภาพอากาศ
      </Typography>

      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography
            component="span"
            sx={{
              width: "33%",
              flexShrink: 0,
              color: "#689f38",
              fontWeight: "bold",
            }}
          >
            การเตรียมข้อมูล (Data Preparation)
          </Typography>
          <Typography component="span" sx={{ color: "text.secondary" }}>
            การเตรียมข้อมูลเป็นขั้นตอนสำคัญที่มีผลโดยตรงต่อประสิทธิภาพของโมเดลที่พัฒนา
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            1.1 การรวบรวมข้อมูล (Data Collection) <br />
            ข้อมูลที่ใช้ในการพัฒนาโมเดลได้มาจากแหล่งข้อมูล
            ประกอบไปด้วยตัวแปรต่าง ๆ ได้แก่: <br /> PM10, CO, NO2, O3, SO2
            (มลพิษทางอากาศ) Temperature, Humidity (ข้อมูลสภาพอากาศ) Province,
            Date (ข้อมูลเชิงพื้นที่และเวลา) PM2.5
            (ค่าฝุ่นละอองขนาดเล็กที่ต้องการพยากรณ์)
            <br />
            1.2 การทำความสะอาดข้อมูล (Data Cleaning) <br />
            ข้อมูลที่ได้มาอาจมีความไม่สมบูรณ์ หรือมีข้อมูลที่หายไป
            จึงต้องทำการกรองข้อมูลที่ไม่เป็นไปตามเงื่อนไขออกไป โดย
            ลบข้อมูลที่มีค่า PM2.5 เป็นค่าว่าง แปลงข้อมูลจังหวัดให้เป็นค่าตัวเลข
            (Encoding) ใช้มาตรฐานค่าเฉลี่ยและส่วนเบี่ยงเบนมาตรฐาน
            (StandardScaler) เพื่อปรับค่าข้อมูลให้เหมาะสมกับการเรียนรู้ของโมเดล
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography
            component="span"
            sx={{
              width: "33%",
              flexShrink: 0,
              color: "#689f38",
              fontWeight: "bold",
            }}
          >
            การเทรนโมเดล (Model Training)
          </Typography>
          <Typography component="span" sx={{ color: "text.secondary" }}>
            การเทรนโมเดลเป็นขั้นตอนสำคัญที่มีผลโดยตรงต่อประสิทธิภาพของโมเดลที่พัฒนา
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            โดยการเทรนโมเดลจะทำแบ่งข้อมูลเป็นชุด Train/Test (80:20) ใช้ PyTorch
            DataLoader เพื่อโหลดข้อมูลเป็น Batch ใช้ Adam Optimizer
            ปรับค่าพารามิเตอร์ของโมเดล ใช้ Epochs จำนวน 500 รอบ
            พร้อมการอัปเดตค่าถ่วงน้ำหนักโดยใช้ Gradient Descent แสดงค่า Loss ทุก
            Epoch เพื่อตรวจสอบการเรียนรู้ของโมเดล
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography
            component="span"
            sx={{
              width: "33%",
              flexShrink: 0,
              color: "#689f38",
              fontWeight: "bold",
            }}
          >
            ทฤษฎีของอัลกอริทึมที่พัฒนา
          </Typography>
          <Typography component="span" sx={{ color: "text.secondary" }}>
            อัลกอริทึมที่ใช้ในการพยากรณ์คุณภาพอากาศ
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            ใช้โครงข่ายประสาทเทียม (Neural Network) แบบ Fully Connected
            การพยากรณ์ค่า PM2.5 (Regression) ใช้โครงสร้างที่ประกอบด้วย <br />
            1. Hidden Layers 4 ชั้นซ่อน พร้อม ReLU Activation
            <br /> 2. Batch Normalization และ Dropout เพื่อลด Overfitting
            <br /> 3. ใช้ Mean Squared Error (MSE) เป็น Loss Function
            <br />
            การจำแนกคุณภาพอากาศ (Classification) ใช้โครงสร้างที่ประกอบด้วย{" "}
            <br />
            1. 3 ชั้นซ่อน พร้อม ReLU Activation
            <br />
            2. Softmax Activation ที่ชั้นสุดท้าย
            <br /> 3. ใช้ CrossEntropyLoss เป็น Loss Function
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography
            component="span"
            sx={{
              width: "33%",
              flexShrink: 0,
              color: "#689f38",
              fontWeight: "bold",
            }}
          >
            สรุป (Summary)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            แนวทางการพัฒนาโมเดลพยากรณ์คุณภาพอากาศประกอบด้วยการเตรียมข้อมูล
            การเลือกอัลกอริทึมที่เหมาะสม และการประเมินผลที่รัดกุม
            ซึ่งทำให้ได้โมเดลที่สามารถพยากรณ์ค่า PM2.5
            ได้อย่างแม่นยำและจำแนกคุณภาพอากาศได้ดี
            เพื่อนำไปใช้ในงานด้านสิ่งแวดล้อมและสุขภาพต่อไป
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Typography variant="h5" sx={{ marginBottom: 2, marginTop: 2 }}>
        การทดสอบและการประเมินผล (Model Evaluation)
      </Typography>

      <Card variant="outlined" sx={{ maxWidth: 360 }}>
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography gutterBottom variant="h5" component="div">
              ผลการทดสอบ Evaluating Regression Model
            </Typography>
          </Stack>

          <Typography variant="body2">
            ผลการทดสอบ Evaluating Regression Model คือ
          </Typography>

          <Typography variant="body1">
            Test Loss (MSE):{" "}
            <strong style={{ color: colors.yellow[900] }}>0.0131</strong> <br />
            Mean Absolute Error:{" "}
            <strong style={{ color: colors.red[600] }}>0.0773</strong> <br />
            Mean Squared Error:{" "}
            <strong style={{ color: colors.red[600] }}>0.0134</strong> <br />
            R² Score:{" "}
            <strong style={{ color: colors.green[700] }}>0.9953</strong> <br />
          </Typography>
        </Box>
        <Divider />
      </Card>

      <Typography variant="h5" sx={{ marginBottom: 2, marginTop: 2 }}>
        ตัวอย่างชุดข้อมูลที่ใช้ในกพัฒนาโมเดล (Dataset) 
      </Typography>
      
      <Typography variant="body2" sx={{ marginBottom: 2 }}>
        ตัวอย่างชุดข้อมูลที่ใช้ในกพัฒนาโมเดลได้มาจามากการ สร้างโดย ChatGPT และมีรายละเอียดดังนี้  <br />
        1. Date: วันที่และเวลาที่ทำการวัดค่าของตัวแปรต่าง ๆ <br />
        2. PM2.5: ค่าฝุ่นละอองขนาดเล็กที่ต้องการพยากรณ์ <br />
        3. PM10: ค่าฝุ่นละอองขนาดใหญ่ที่ต้องการพยากรณ์ <br />
        4. CO: ค่าคาร์บอนมอนอกไซด์ที่ต้องการพยากรณ์ <br />
        5. NO2: ค่าไนโตรเจนไดออกไซด์ที่ต้องการพยากรณ์ <br />
        6. O3: ค่าโอโซนที่ต้องการพยากรณ์ <br />
        7. SO2: ค่ากำมะถันไดออกไซด์ที่ต้องการพยากรณ์ <br />
        8. Temperature: ค่าอุณหภูมิที่ต้องการพยากรณ์ <br />
        9. Humidity: ค่าความชื้นที่ต้องการพยากรณ์ <br />
        10. Province: จังหวัดที่ทำการวัดค่าของตัวแปรต่าง ๆ
      </Typography>

      <Button 
        variant="contained" 
        type="submit"      
        style={{backgroundColor: '#7cb342', color: 'white', marginBottom: 2, marginTop: 2}} 
        href="https://drive.google.com/file/d/1ofkLUpauGxHcSvurlCKK6KPPAjJNm04y/view?usp=drive_link"   
        target="_blank"          
      >
        ดาวน์โหลดชุดข้อมูล
      </Button>

      <TableContainer component={Paper} xs={{ marginTop: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell> Date </TableCell>
              <TableCell align="right">PM2.5</TableCell>
              <TableCell align="right">PM10</TableCell>
              <TableCell align="right">CO </TableCell>
              <TableCell align="right">NO2 </TableCell>
               <TableCell align="right">O3 </TableCell>
               <TableCell align="right">SO2 </TableCell>
               <TableCell align="right">Temperature   </TableCell>
               <TableCell align="right"> Humidity </TableCell>
              <TableCell align="right"> Province </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.Date}
                </TableCell>
                <TableCell align="right">{row.PM2_5}</TableCell>
                <TableCell align="right">{row.PM10}</TableCell>
                <TableCell align="right">{row.CO}</TableCell>
                <TableCell align="right">{row.NO2}</TableCell>
                <TableCell align="right">{row.O3}</TableCell>
                <TableCell align="right">{row.SO2}</TableCell>
                <TableCell align="right">{row.Temperature}</TableCell>
                <TableCell align="right">{row.Humidity}</TableCell>
                <TableCell align="right">{row.Province}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RepostSVR;

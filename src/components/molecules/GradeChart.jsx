import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import Card from "@/components/atoms/Card";

const GradeChart = ({ grades, title = "Grade Distribution" }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "donut",
        height: 350,
        toolbar: {
          show: false
        }
      },
      colors: ["#7c3aed", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"],
      labels: ["A", "B", "C", "D", "F"],
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif"
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%"
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return Math.round(val) + "%";
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }]
    }
  });

  useEffect(() => {
    if (grades && grades.length > 0) {
      // Calculate grade distribution
      const distribution = grades.reduce((acc, grade) => {
        const percentage = (grade.points / grade.maxPoints) * 100;
        let letterGrade;
        
        if (percentage >= 90) letterGrade = "A";
        else if (percentage >= 80) letterGrade = "B";
        else if (percentage >= 70) letterGrade = "C";
        else if (percentage >= 60) letterGrade = "D";
        else letterGrade = "F";
        
        acc[letterGrade] = (acc[letterGrade] || 0) + 1;
        return acc;
      }, {});

      const series = ["A", "B", "C", "D", "F"].map(grade => distribution[grade] || 0);

      setChartData(prev => ({
        ...prev,
        series
      }));
    }
  }, [grades]);

  if (!grades || grades.length === 0) {
    return (
      <Card variant="premium" className="p-6 text-center">
        <p className="text-gray-500">No grades available for chart</p>
      </Card>
    );
  }

  return (
    <Card variant="premium" className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ReactApexChart 
        options={chartData.options} 
        series={chartData.series} 
        type="donut" 
        height={350} 
      />
    </Card>
  );
};

export default GradeChart;
import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import Card from "@/components/atoms/Card";

const GradeChart = ({ grades, title = "Grade Distribution", showGoals = false, courses = [] }) => {
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

  const [goalProgressData, setGoalProgressData] = useState({
    series: [],
    options: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: { show: false }
      },
      colors: ["#10b981", "#7c3aed"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toFixed(1) + "%";
        }
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: "12px"
          }
        }
      },
      yaxis: {
        title: {
          text: "Grade (%)"
        },
        max: 100
      },
      legend: {
        position: "top"
      }
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

    // Calculate goal progress if showing goals
    if (showGoals && courses.length > 0 && grades.length > 0) {
      const courseProgress = courses.map(course => {
        const courseGrades = grades.filter(g => g.courseId === course.Id.toString());
        if (courseGrades.length === 0) return null;

        const totalWeightedPoints = courseGrades.reduce((sum, grade) => {
          const percentage = (grade.points / grade.maxPoints) * 100;
          return sum + (percentage * grade.weight) / 100;
        }, 0);
        
        const totalWeight = courseGrades.reduce((sum, grade) => sum + grade.weight, 0);
        const currentAverage = totalWeight > 0 ? (totalWeightedPoints / totalWeight) * 100 : 0;
        const goalTarget = course.gradeGoal || 85;

        return {
          courseName: course.name,
          current: currentAverage,
          goal: goalTarget
        };
      }).filter(Boolean);

      if (courseProgress.length > 0) {
        setGoalProgressData(prev => ({
          ...prev,
          series: [
            {
              name: "Current Grade",
              data: courseProgress.map(p => p.current)
            },
            {
              name: "Goal",
              data: courseProgress.map(p => p.goal)
            }
          ],
          options: {
            ...prev.options,
            xaxis: {
              ...prev.options.xaxis,
              categories: courseProgress.map(p => p.courseName.split(' ').slice(0, 2).join(' '))
            }
          }
        }));
      }
    }
  }, [grades, showGoals, courses]);

  if (!grades || grades.length === 0) {
    return (
      <Card variant="premium" className="p-6 text-center">
        <p className="text-gray-500">No grades available for chart</p>
      </Card>
    );
  }

if (showGoals) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="premium" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
          <ReactApexChart 
            options={chartData.options} 
            series={chartData.series} 
            type="donut" 
            height={350} 
          />
        </Card>
        
        <Card variant="premium" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals vs Current</h3>
          <ReactApexChart 
            options={goalProgressData.options} 
            series={goalProgressData.series} 
            type="bar" 
            height={350} 
          />
        </Card>
      </div>
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
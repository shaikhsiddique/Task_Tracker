import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays, format } from "date-fns";

function ProductivityHeatmap({ user }) {
  const getActivityHeatmap = () => {
    const heatmap = {};
    const addDate = (dateStr) => {
      if (!dateStr) return;
      const date = format(new Date(dateStr), "yyyy-MM-dd");
      heatmap[date] = (heatmap[date] || 0) + 1;
    };

    addDate(user.createdAt);
    addDate(user.updatedAt);
    user?.tasks?.forEach((task) => {
      addDate(task.assignedAt);
      addDate(task.createdAt);
      addDate(task.updatedAt);
      if (task.completedAt) addDate(task.completedAt);
    });

    const startDate = subDays(new Date(), 180);
    const endDate = new Date();
    const dateList = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const key = format(new Date(d), "yyyy-MM-dd");
      dateList.push({ date: key, count: heatmap[key] || 0 });
    }

    return dateList;
  };

  const getClassForValue = (value) => {
    if (!value || value.count === 0) return "fill-white stroke-gray-300";
    if (value.count >= 5) return "fill-green-900";
    if (value.count >= 4) return "fill-green-700";
    if (value.count >= 3) return "fill-green-500";
    if (value.count >= 2) return "fill-green-300";
    return "fill-green-100";
  };

  return (
    <div className="mt-10 bg-white rounded-lg shadow p-4 w-[80%] h-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">📅 Activity </h3>
      <p className="text-gray-500 mb-4">Activity over the last 6 months</p>

      <div className="overflow-x-auto min-w-[400px] pl-8 pb-8 pt-2 pr-2">
        <div className="relative">
          <CalendarHeatmap
            startDate={subDays(new Date(), 180)}
            endDate={new Date()}
            values={getActivityHeatmap()}
            showWeekdayLabels={false}
            gutterSize={5}
            classForValue={getClassForValue}
            tooltipDataAttrs={(value) => ({
              "data-tip": `${value.date}: ${value.count} activit${value.count === 1 ? "y" : "ies"}`,
            })}
            transformDayElement={(element, value, index) => {
              if (!value || !value.date) return element;
              const day = new Date(value.date).getDate();
              // Center the text perfectly
              return (
                <g key={index}>
                  {React.cloneElement(element, {
                    ...element.props,
                    rx: 1,
                    ry: 1,
                    width: 11,
                    height: 11,
                  })}
                  <text 
                    x={+element.props.x + 5.5}
                    y={+element.props.y + 5.5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#222"
                    fontSize="1px"
                    fontWeight="thin"
                    pointerEvents="none"
                  >
                    {day}
                  </text>
                </g>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductivityHeatmap;

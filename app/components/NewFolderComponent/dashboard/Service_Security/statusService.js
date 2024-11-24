import GeographicDistributionChart from "../../SectionSecurity/secuGraph/geoGrap";
import ReportsByPersonChart from "../../SectionSecurity/secuGraph/reportGraph";
import SignalementCharts from "../../SectionSecurity/secuGraph/statusChart";

export default function ServiceStatus() {

    return(
        <div>
            <GeographicDistributionChart />
            <ReportsByPersonChart />
            <SignalementCharts />
        </div>
    );
};
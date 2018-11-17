import { useMemo } from 'react';
import useFetch from 'fetch-suspense';

const baseLegacyReportUrl = 'https://ngftg30rl3.execute-api.eu-central-1.amazonaws.com/prod/reports/';

export default reportDatabaseId => useMemo(() => JSON.parse(useFetch(`${baseLegacyReportUrl + reportDatabaseId}`)), [
  reportDatabaseId,
]);

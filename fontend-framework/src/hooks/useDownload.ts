const useDownload = () => {
  const handleDownload = (type: string) => {
    // 文件路径，基于 /public
    //const url = '/data.json';
    //const url = '/Lidar_Security_Protection_Guide.docx';
    //const url = '/Lidar_Highway_Topology_Anomaly_Analysis.docx';
    //const url = '/Lidar_Risk_Threat_Matrix.docx';
    const url = '/ISAC_traffic_security_analysis.docx';

    // 创建一个临时的 a 标签用于下载
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}.${url.split('.')[url.split('.').length - 1]}`; // 设置下载文件名

    document.body.append(link);
    link.click();

    // 清理资源
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return {
    handleDownload,
  };
};

export default useDownload;

import { Box, Grid, Typography, styled } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibilityFilter } from 'src/store/apps/tiketKonsultasi/TiketKonsultasiSlice';

const BoxStyled = styled(Box)(() => ({
    padding: '30px',
    transition: '0.1s ease-in',
    cursor: 'pointer',
    color: 'inherit',
    '&:hover': {
      transform: 'scale(1.03)',
    },
  }));

const KonsultasiFilter = () => {
    const dispatch = useDispatch();
    const konsultasiWaliSiswa = useSelector((state) => state.konsultasi.konsultasiWaliSiswa || []);

    // Hitung jumlah status konsultasi
    const statusCounts = {
        Diajukan: 0,
        Disetujui: 0,
        Ditolak: 0,
        Selesai: 0
      };
    
    if (Array.isArray(konsultasiWaliSiswa)) {
        konsultasiWaliSiswa.forEach((k) => {
            if (statusCounts.hasOwnProperty(k.status_konseling)) {
                statusCounts[k.status_konseling]++;
            }
        });
    }

    return (
        <Grid container spacing={3} textAlign="center">
            <Grid item xs={12} sm={6} lg={3}>
                <BoxStyled
                onClick={() => dispatch(setVisibilityFilter('all'))}
                sx={{ backgroundColor: 'primary.light', color: 'primary.main' }}
                >
                <Typography variant="h3">{konsultasiWaliSiswa.length}</Typography>
                <Typography variant="h6">Total Konsultasi</Typography>
                </BoxStyled>
            </Grid>
            {Object.keys(statusCounts).map((status) => (
        <Grid item xs={12} sm={6} lg={3} key={status}>
          <BoxStyled
            onClick={() => dispatch(setVisibilityFilter(status))}
            sx={{ backgroundColor: getStatusColor(status), color: getStatusColor(status, true) }}
          >
            <Typography variant="h3">{statusCounts[status]}</Typography>
            <Typography variant="h6">{status}</Typography>
          </BoxStyled>
        </Grid>
      ))}
    </Grid>
    )
}

// Helper function to get color based on status
const getStatusColor = (status, textColor = false) => {
    const colors = {
      Diajukan: 'warning',
      Disetujui: 'info',
      Ditolak: 'error',
      Selesai: 'success'
    };
    return textColor ? `${colors[status]}.main` : `${colors[status]}.light`;
  };

  export default KonsultasiFilter;
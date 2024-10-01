import React, { useState, useEffect } from "react";
import { Grid, Box, MenuItem, InputAdornment } from '@mui/material';
import CustomFormLabel from "src/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "src/components/forms/theme-elements/CustomSelect";
import SubmitButton from "../../buttonGroup/SubmitButton";
import CancelButton from "../../buttonGroup/CancelButton";
import CustomOutlinedInput from "src/components/forms/theme-elements/CustomOutlinedInput";
import { IconAward, IconBuilding, IconCategory, IconTrophy, IconClipboardList } from '@tabler/icons';
import axiosInstance from "src/utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const PrestasiMadrasahEditForm = ({ prestasi, setSuccess, setError, isLoading }) => {
    const [tingkatanOptions, setTingkatanOptions] = useState([]);
    const [juaraOptions, setJuaraOptions] = useState([]);
    const navigate = useNavigate();
    const [formState, setFormState] = useState({
        lomba: "",
        tingkatId: "",
        juaraId: "",
        penyelenggara: "",
        keterangan:""
    });

   

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [responseTingkatan, responseJuara] = await Promise.all([
                    axiosInstance.get('/options/tingkatan'),
                    axiosInstance.get('/options/juara')
                ]);
                setTingkatanOptions(responseTingkatan.data);
                setJuaraOptions(responseJuara.data);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.msg) {
                    console.error("Error fetching data:", error.response.data);
                    setError(error.response.data.msg);
                } else {
                    console.error("Terjadi kesalahan:", error.message);
                    setError("Terjadi kesalahan saat memuat data");
                }
                    setTimeout(() => {
                        setError("");
                    }, 3000);
            }
        };

        fetchOptions();
    }, [setError]);

    useEffect(() => {
        if (prestasi) {
            setFormState({
                lomba: prestasi.lomba,
                tingkatId: prestasi.tingkat_id,
                juaraId: prestasi.juara_id,
                penyelenggara: prestasi.penyelenggara,
                keterangan: prestasi.keterangan
            });
        }
    }, [prestasi]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axiosInstance.put(`/prestasi-madrasah/${prestasi.id}`, {
                lomba: formState.lomba,
                tingkat_id: formState.tingkatId,
                juara_id: formState.juaraId,
                penyelenggara: formState.penyelenggara,
                keterangan: formState.keterangan
            });
            setSuccess("Prestasi madrasah berhasil diubah");
            setTimeout(() => navigate('/dashboard/admin/prestasi/madrasah'), 3000);
        } catch (error) {
            setError(error.response?.data?.msg || "Terjadi kesalahan saat mengubah prestasi");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                        <CustomFormLabel htmlFor="lomba" sx={{ mt: 0, mb: 1 }}>
                            Lomba
                        </CustomFormLabel>
                    </Box>
                    <CustomOutlinedInput
                        startAdornment={<InputAdornment position="start"><IconTrophy /></InputAdornment>}
                        id="lomba"
                        name="lomba"
                        value={formState.lomba}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                        <CustomFormLabel htmlFor="tingkatId" sx={{ mt: 0, mb: 1 }}>
                            Tingkat
                        </CustomFormLabel>
                    </Box>
                    <CustomSelect
                        id="tingkatId"
                        name="tingkatId"
                        value={formState.tingkatId}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        startAdornment={<InputAdornment position="start"><IconCategory /></InputAdornment>}
                        required
                    >
                        {tingkatanOptions.map((tingkatan) => (
                            <MenuItem key={tingkatan.id} value={tingkatan.id}>
                                {tingkatan.nama_tingkatan}
                            </MenuItem>
                        ))}
                    </CustomSelect>
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                        <CustomFormLabel htmlFor="juaraId" sx={{ mt: 0, mb: 1 }}>
                            Juara
                        </CustomFormLabel>
                    </Box>
                    <CustomSelect
                        id="juaraId"
                        name="juaraId"
                        value={formState.juaraId}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        startAdornment={<InputAdornment position="start"><IconAward /></InputAdornment>}
                        required
                    >
                        {juaraOptions.map((juara) => (
                            <MenuItem key={juara.id} value={juara.id}>
                                {juara.nama_juara}
                            </MenuItem>
                        ))}
                    </CustomSelect>
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                        <CustomFormLabel htmlFor="penyelenggara" sx={{ mt: 0, mb: 1 }}>
                            Penyelenggara
                        </CustomFormLabel>
                    </Box>
                    <CustomOutlinedInput
                        id="penyelenggara"
                        name="penyelenggara"
                        value={formState.penyelenggara}
                        onChange={handleChange}
                        startAdornment={<InputAdornment position="start"><IconBuilding /></InputAdornment>}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                        <CustomFormLabel htmlFor="keterangan" sx={{ mt: 0, mb: 1 }}>
                            Keterangan
                        </CustomFormLabel>
                    </Box>
                    <CustomOutlinedInput
                        id="keterangan"
                        name="keterangan"
                        value={formState.keterangan}
                        onChange={handleChange}
                        startAdornment={<InputAdornment position="start"><IconClipboardList/></InputAdornment>}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <SubmitButton isLoading={isLoading}/>
                    <CancelButton onClick={handleCancel}>Batal</CancelButton>
                </Grid>
            </Grid>
        </form>
    );
};

PrestasiMadrasahEditForm.propTypes = {
    prestasi: PropTypes.object.isRequired,
    setSuccess: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired
};

export default PrestasiMadrasahEditForm;
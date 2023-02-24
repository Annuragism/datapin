import React from "react"
import { Dialog, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material"
import "./filterModal.css"

const filters = [
  { name: "document_type", values: ["all", "id-card", "payslip"] },
  { name: "status", values: ["pending", "complete", "ERROR"] },
  { name: "date" }
]

const FilterModal = ({ filterModal, setFilterModal }) => {

  return (
    <Dialog
      open={filterModal}
      onClose={() => setFilterModal(false)}
      fullWidth
    >
      <DialogTitle>{`Filtre`}</DialogTitle>
      <DialogContent>
        <Grid container>
          {filters.map((elem) => (
            <Grid item xs={12} className="filter-grid-item">
              <Grid container>
                <Grid item xs={4}>
                  <div>{elem.name}</div>
                </Grid>
                <Grid item xs={8}>
                  <FormControl fullWidth>
                    <InputLabel>{elem.name}</InputLabel>
                    <Select size="small" value={"all"} label={elem.name}>
                      <MenuItem value="all">Tous</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  )

}

export default FilterModal
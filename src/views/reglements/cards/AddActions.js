// ** Next Import

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import IconifyIcon from 'src/@core/components/icon'

// ** Icon Imports

const OptionsWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

const AddActions = ({
  handleSubmit,
  edit = false,
  setShowInvoice = () => {},
  printInvoice = () => {},
  mainAction = 'créer',
  disabled = false
}) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Button
              disabled={disabled}
              onClick={handleSubmit}
              fullWidth
              sx={{ mb: 3.5 }}
              variant='contained'
              startIcon={<IconifyIcon icon='mdi:send-outline' />}
            >
              {mainAction}
            </Button>
            {/* {edit && (
              <>
                <Button onClick={() => setShowInvoice(true)} fullWidth sx={{ mb: 3.5 }} variant="outlined">
                  Prévu
                </Button>
                <Button onClick={printInvoice} fullWidth sx={{ mb: 3.5 }} variant="outlined">
                  Imprimer
                </Button>
              </>
            )} */}
            {/*<Button fullWidth variant='outlined' sx={{ mb: 3.5 }}>
              Save
            </Button> */}
          </CardContent>
        </Card>
      </Grid>
      {/* <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id='payment-select'>Accept payments via</InputLabel>
          <Select
            fullWidth
            defaultValue='Internet Banking'
            label='Accept payments via'
            labelId='payment-select'
            sx={{ mb: 4 }}
          >
            <MenuItem value='Internet Banking'>Internet Banking</MenuItem>
            <MenuItem value='Debit Card'>Debit Card</MenuItem>
            <MenuItem value='Credit Card'>Credit Card</MenuItem>
            <MenuItem value='Paypal'>Paypal</MenuItem>
            <MenuItem value='UPI Transfer'>UPI Transfer</MenuItem>
          </Select>
        </FormControl>
        <OptionsWrapper sx={{ mb: 1 }}>
          <InputLabel
            htmlFor='invoice-add-payment-terms'
            sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
          >
            Payment Terms
          </InputLabel>
          <Switch defaultChecked id='invoice-add-payment-terms' />
        </OptionsWrapper>
        <OptionsWrapper sx={{ mb: 1 }}>
          <InputLabel
            htmlFor='invoice-add-client-notes'
            sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
          >
            Client Notes
          </InputLabel>
          <Switch id='invoice-add-client-notes' />
        </OptionsWrapper>
        <OptionsWrapper>
          <InputLabel
            htmlFor='invoice-add-payment-stub'
            sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
          >
            Payment Stub
          </InputLabel>
          <Switch id='invoice-add-payment-stub' />
        </OptionsWrapper>
      </Grid> */}
    </Grid>
  )
}

export default AddActions

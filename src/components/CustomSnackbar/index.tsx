import clsx from 'clsx'
import Card from '@mui/material/Card'
import Paper from '@mui/material/Paper'
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import CardActions from '@mui/material/CardActions'
import { useState, forwardRef, useCallback } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useSnackbar, SnackbarContent, CustomContentProps } from 'notistack'

const useStyles = makeStyles(() => ({
  root: {
    '@media (min-width:600px)': {
      minWidth: '344px !important',
    },
  },
  card: {
    backgroundColor: '#fddc6c',
    width: '100%',
  },
  typography: {
    color: '#000',
  },
  actionRoot: {
    padding: '8px 8px 8px 16px',
    justifyContent: 'space-between',
  },
  icons: {
    marginLeft: 'auto',
  },
  expand: {
    padding: '8px 8px',
    transform: 'rotate(0deg)',
    color: '#000',
    transition: 'all .2s',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  paper: {
    backgroundColor: '#fff',
    padding: 16,
  },
  checkIcon: {
    fontSize: 20,
    paddingRight: 4,
  },
  button: {
    padding: 0,
    textTransform: 'none',
  },
}))

interface ReportCompleteProps extends CustomContentProps {
  allowDownload?: boolean
}

const ReportComplete = forwardRef<HTMLDivElement, ReportCompleteProps>(({ id, ...props }, ref) => {
  const classes = useStyles()
  const { closeSnackbar } = useSnackbar()
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = useCallback(() => {
    setExpanded(oldExpanded => !oldExpanded)
  }, [])

  const handleDismiss = useCallback(() => {
    closeSnackbar(id)
  }, [id, closeSnackbar])

  return (
    <SnackbarContent ref={ref} className={classes.root}>
      <Card className={classes.card}>
        <CardActions classes={{ root: classes.actionRoot }}>
          <Typography variant='body2' className={classes.typography}>
            {props.message}
          </Typography>
          <div className={classes.icons}>
            <IconButton
              aria-label='Show more'
              size='small'
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
            >
              <ExpandMoreIcon />
            </IconButton>
            <IconButton size='small' className={classes.expand} onClick={handleDismiss}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </div>
        </CardActions>
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <Paper className={classes.paper}>
            <Typography gutterBottom variant='caption' style={{ color: '#000', display: 'block' }}>
              PDF ready
            </Typography>
            <Button size='small' color='primary' className={classes.button}>
              <CheckCircleIcon className={classes.checkIcon} />
              Download now
            </Button>
          </Paper>
        </Collapse>
      </Card>
    </SnackbarContent>
  )
})

ReportComplete.displayName = 'ReportComplete'

export default ReportComplete

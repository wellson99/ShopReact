import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'

export default function LoadingModal({show, loading, error, showStateChanger}){
  return(
      <Modal
        show={show}
        onHide={() => showStateChanger(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Custom Modal Styling
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && (
            <Spinner animation="border" variant="primary"/>
          )}
          <p>
            {error}
          </p>
        </Modal.Body>
      </Modal>
  )
}
$(document).ready(function () {
  // Loader
  $('#loader').fadeOut();

  let selectedRating = 0;
  let reviewIdToDelete = null;
  let reviewIdToEdit = null;

  // Initialize tooltips
  $('[data-bs-toggle="tooltip"]').tooltip();

  // Star rating selection
  $('#ratingStars i').on('click', function () {
    selectedRating = $(this).data('rating');
    $('#ratingStars i').each(function () {
      if ($(this).data('rating') <= selectedRating) {
        $(this).removeClass('far').addClass('fas');
      } else {
        $(this).removeClass('fas').addClass('far');
      }
    });
    $('#ratingInput').val(selectedRating);
  });

  // Load reviews
  function loadReviews() {
    $.ajax({
      url: '/reviews',
      method: 'GET',
      success: function (reviews) {
        $('#reviewsList').empty();
        reviews.forEach(review => {
          const reviewHtml = `
            <div class="col-md-6">
              <div class="card review-card p-3">
                <div class="d-flex align-items-center mb-2">
                  <h5 class="me-auto mb-0">${review.name}</h5>
                  <div class="review-rating">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
                <p class="review-text">${review.reviewText}</p>
                <div class="review-actions">
                  <button class="btn btn-warning btn-sm edit-btn" data-id="${review.id}" data-email="${review.email}">Edit</button>
                  <button class="btn btn-danger btn-sm delete-btn" data-id="${review.id}" data-email="${review.email}">Delete</button>
                </div>
              </div>
            </div>
          `;
          $('#reviewsList').append(reviewHtml).hide().fadeIn(600);
        });
      },
      error: function () {
        alert('Failed to load reviews');
      }
    });
  }

  loadReviews();

  // Show modal for email confirmation to add a review
  $('#reviewForm').on('submit', function (e) {
    e.preventDefault();
    if (selectedRating === 0) {
      alert('Please select a rating');
    } else {
      $('#reviewModal').modal('show');
    }
  });

  // Confirm email for adding a review
  $('#emailForm').on('submit', function (e) {
    e.preventDefault();

    const email = $('#emailInput').val();
    const confirmEmail = $('#confirmEmailInput').val();

    if (email === confirmEmail) {
      const name = $('#nameInput').val();
      const rating = $('#ratingInput').val();
      const reviewText = $('#reviewTextInput').val();

      $.ajax({
        url: '/add-review',
        method: 'POST',
        data: { name, email, rating, reviewText },
        success: function () {
          $('#reviewModal').modal('hide');
          loadReviews();
          $('#reviewForm')[0].reset();
          selectedRating = 0;
          $('#ratingStars i').removeClass('fas').addClass('far');
        },
        error: function () {
          alert('Failed to add review');
        }
      });
    } else {
      alert('Emails do not match');
    }
  });

  // Show modal for email confirmation to delete a review
  $(document).on('click', '.delete-btn', function () {
    reviewIdToDelete = $(this).data('id');
    $('#deleteReviewModal').modal('show');
  });

  // Confirm email for deleting a review
  $('#deleteEmailForm').on('submit', function (e) {
    e.preventDefault();

    const email = $('#deleteEmailInput').val();

    $.ajax({
      url: `/delete-review/${reviewIdToDelete}`,
      method: 'DELETE',
      data: { email },
      success: function () {
        $('#deleteReviewModal').modal('hide');
        loadReviews();
      },
      error: function (xhr) {
        alert(xhr.responseJSON.error);
      }
    });
  });

  // Show modal for email confirmation to edit a review
  $(document).on('click', '.edit-btn', function () {
    reviewIdToEdit = $(this).data('id');
    $('#editReviewModal').modal('show');
  });

  // Confirm email for editing a review
  $('#editEmailForm').on('submit', function (e) {
    e.preventDefault();

    const email = $('#editEmailInput').val();
    const updatedReviewText = $('#editReviewText').val();
    const updatedRating = $('#editRatingInput').val();

    $.ajax({
      url: `/edit-review/${reviewIdToEdit}`,
      method: 'PUT',
      data: { email, updatedReviewText, updatedRating },
      success: function () {
        $('#editReviewModal').modal('hide');
        loadReviews();
      },
      error: function (xhr) {
        alert(xhr.responseJSON.error);
      }
    });
  });
});
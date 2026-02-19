// main.js — SkillSwap

$(document).ready(function () {
  // -------------------------------
  // Global: tooltips for placeholders
  // -------------------------------
  $('.footer-nav a[href="#"]').attr('title', 'This feature is not yet available');
  $('.job-link[href="#"]').attr('title', 'This feature is not yet available');
  $('.view-btn[href="#"]').attr('title', 'This feature is not yet available');
  $('.edit-btn[href="#"]').attr('title', 'This feature is not yet available');
  $('.applicants-btn[href="#"]').attr('title', 'This feature is not yet available');
  $('.forgot-link[href="#"]').attr('title', 'This feature is not yet available');
  $('.terms-link[href="#"]').attr('title', 'This feature is not yet available');

  // -------------------------------
  // Index: filters + search
  // -------------------------------
  if ($('.filter-nav').length && $('.job-listings').length) {
    $('.filter-nav li a').on('click', function (e) {
      e.preventDefault();

      $('.filter-nav li a').removeClass('active');
      $(this).addClass('active');

      var filter = $(this).text().trim().toLowerCase();

      if (filter === 'all') {
        $('.job-card').fadeIn(300);
        return;
      }

      $('.job-card').each(function () {
        var category = $(this).find('.job-meta').text().toLowerCase();
        if (category.indexOf(filter) !== -1) {
          $(this).fadeIn(300);
        } else {
          $(this).fadeOut(200);
        }
      });
    });

    $('.search-form input').on('input', function () {
      var query = $(this).val().toLowerCase();

      $('.filter-nav li a').removeClass('active');
      $('.filter-nav li a').first().addClass('active');

      $('.job-card').each(function () {
        var title = $(this).find('.job-title').text().toLowerCase();
        var category = $(this).find('.job-meta').text().toLowerCase();

        if (title.indexOf(query) !== -1 || category.indexOf(query) !== -1) {
          $(this).fadeIn(300);
        } else {
          $(this).fadeOut(200);
        }
      });
    });

    $('.search-form').on('submit', function (e) {
      e.preventDefault();
    });
  }

  // -------------------------------
  // My Jobs: filter tabs + mark complete
  // -------------------------------
  if ($('.jobs-filter-nav').length && $('.my-jobs-list').length) {
    $('.jobs-filter-nav li a').on('click', function (e) {
      e.preventDefault();

      $('.jobs-filter-nav li a').removeClass('active');
      $(this).addClass('active');

      var filter = $(this).text().trim().toLowerCase();

      if (filter === 'all') {
        $('.my-job-card').fadeIn(300);
        return;
      }

      $('.my-job-card').each(function () {
        var $card = $(this);

        if (filter === 'posted by me') {
          var type = $card.find('.job-type-badge').text().toLowerCase();
          type.indexOf('posted by me') !== -1 ? $card.fadeIn(300) : $card.fadeOut(200);
          return;
        }

        if (filter === 'in progress') {
          var status1 = $card.find('.status-badge').text().toLowerCase();
          status1.indexOf('in progress') !== -1 ? $card.fadeIn(300) : $card.fadeOut(200);
          return;
        }

        if (filter === 'completed') {
          var status2 = $card.find('.status-badge').text().toLowerCase();
          status2.indexOf('completed') !== -1 ? $card.fadeIn(300) : $card.fadeOut(200);
          return;
        }
      });
    });

    $('.complete-btn').on('click', function (e) {
      e.preventDefault();

      var $card = $(this).closest('.my-job-card');

      $card
        .find('.status-badge')
        .removeClass('status-progress')
        .addClass('status-completed')
        .text('Completed');

      $(this).text('✓ Done').css({ 'pointer-events': 'none', opacity: '0.6' });
    });
  }

  // -------------------------------
  // My Credits: total calculation
  // -------------------------------
  if ($('#totalAmount').length) {
    var total = 0;

    $('.t-amount').each(function () {
      total += parseInt($(this).text(), 10);
    });

    $('#totalAmount').text(total);
  }

  // -------------------------------
  // Post Job: image upload preview
  // -------------------------------
  if ($('#uploadArea').length) {
    var uploadArea = document.getElementById('uploadArea');
    var fileInput = document.getElementById('jobImage');
    var imagePreview = document.getElementById('imagePreview');

    if (uploadArea && fileInput) {
      uploadArea.addEventListener('click', function () {
        fileInput.click();
      });

      uploadArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
      });

      uploadArea.addEventListener('dragleave', function () {
        uploadArea.classList.remove('drag-over');
      });

      uploadArea.addEventListener('drop', function (e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');

        if (e.dataTransfer.files.length) {
          fileInput.files = e.dataTransfer.files;
          showPreview(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', function () {
        if (fileInput.files.length) {
          showPreview(fileInput.files[0]);
        }
      });
    }

    function showPreview(file) {
      if (!imagePreview) return;

      var reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.innerHTML = '<img src="' + e.target.result + '" alt="Preview" />';
        imagePreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  }

  // -------------------------------
  // Post Job: validation (ALLOW submit to PHP if valid)
  // -------------------------------
  if ($('.postjob-form').length) {
    $('.postjob-form').on('submit', function (e) {
      var errors = [];

      var title = $('#jobTitle').val().trim();
      var category = $('#jobCategory').val();
      var credits = parseInt($('#jobCredits').val(), 10);
      var description = $('#jobDescription').val().trim();

      if (title.length < 3) {
        errors.push('Job title must be at least 3 characters long.');
        $('#jobTitle').addClass('input-error');
      } else {
        $('#jobTitle').removeClass('input-error');
      }

      if (!category) {
        errors.push('Please select a category.');
        $('#jobCategory').addClass('input-error');
      } else {
        $('#jobCategory').removeClass('input-error');
      }

      if (isNaN(credits) || credits < 5 || credits > 500) {
        errors.push('Credits must be between 5 and 500.');
        $('#jobCredits').addClass('input-error');
      } else {
        $('#jobCredits').removeClass('input-error');
      }

      if (description.length < 20) {
        errors.push('Description must be at least 20 characters long.');
        $('#jobDescription').addClass('input-error');
      } else {
        $('#jobDescription').removeClass('input-error');
      }

      $('.form-error-list').remove();

      if (errors.length > 0) {
        e.preventDefault();

        var errorHtml = '<div class="form-error-list"><ul>';
        for (var i = 0; i < errors.length; i++) {
          errorHtml += '<li>' + errors[i] + '</li>';
        }
        errorHtml += '</ul></div>';

        $('.form-actions').before(errorHtml);
      }
      // no preventDefault when valid -> form POSTS to save_job.php
    });

    $('.postjob-form .form-input, .postjob-form .form-select, .postjob-form .form-textarea').on('focus', function () {
      $(this).removeClass('input-error');
    });
  }

  // -------------------------------
  // Auth: tabs + client-side validation (DOES NOT block server submit)
  // -------------------------------
  if ($('.auth-tabs').length) {
    $('.auth-tab').on('click', function () {
      var isLogin = $(this).attr('id') === 'loginTab';

      if (isLogin) {
        $('#loginForm').removeClass('hidden');
        $('#signupForm').addClass('hidden');
        $('#loginTab').addClass('active');
        $('#signupTab').removeClass('active');
      } else {
        $('#signupForm').removeClass('hidden');
        $('#loginForm').addClass('hidden');
        $('#signupTab').addClass('active');
        $('#loginTab').removeClass('active');
      }
    });

    // Optional: keep client validations, but do NOT prevent server submit
    $('#signupForm').on('submit', function (e) {
      var errors = [];

      var firstName = $('#firstName').val().trim();
      var lastName = $('#lastName').val().trim();
      var email = $('#signupEmail').val().trim();
      var password = $('#signupPassword').val();
      var confirm = $('#confirmPassword').val();

      var nameRegex = /^[A-Za-z\u0590-\u05FF]{2,}$/;
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nameRegex.test(firstName)) {
        errors.push('First name must be at least 2 letters.');
        $('#firstName').addClass('input-error');
      } else {
        $('#firstName').removeClass('input-error');
      }

      if (!nameRegex.test(lastName)) {
        errors.push('Last name must be at least 2 letters.');
        $('#lastName').addClass('input-error');
      } else {
        $('#lastName').removeClass('input-error');
      }

      if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address.');
        $('#signupEmail').addClass('input-error');
      } else {
        $('#signupEmail').removeClass('input-error');
      }

      if (password.length < 8 || !/\d/.test(password)) {
        errors.push('Password must be at least 8 characters with at least 1 number.');
        $('#signupPassword').addClass('input-error');
      } else {
        $('#signupPassword').removeClass('input-error');
      }

      if (password !== confirm) {
        errors.push('Passwords do not match.');
        $('#confirmPassword').addClass('input-error');
      } else {
        $('#confirmPassword').removeClass('input-error');
      }

      if (!$('#agreeTerms').is(':checked')) {
        errors.push('You must agree to the Terms of Service.');
      }

      $('.form-error-list').remove();

      if (errors.length > 0) {
        e.preventDefault();

        var errorHtml = '<div class="form-error-list"><ul>';
        for (var i = 0; i < errors.length; i++) {
          errorHtml += '<li>' + errors[i] + '</li>';
        }
        errorHtml += '</ul></div>';

        $('#signupForm .auth-btn').first().before(errorHtml);
      }
    });

    $('#loginForm').on('submit', function (e) {
      var email2 = $('#loginEmail').val().trim();
      var password2 = $('#loginPassword').val();

      $('.login-success').remove();

      if (!email2 || !password2) {
        e.preventDefault();
        alert('Please fill in all fields.');
      }
      // if valid -> allow POST to login.php
    });

    $('.auth-form .form-input').on('focus', function () {
      $(this).removeClass('input-error');
    });
  }

  // -------------------------------
  // Buy credits button feedback
  // -------------------------------
  $('.buybtn').on('click', function () {
    var $btn = $(this);

    $btn.text('✓ Coming Soon!').css({ opacity: '0.7', 'pointer-events': 'none' });

    setTimeout(function () {
      $btn.text('Buy Credits').css({ opacity: '1', 'pointer-events': 'auto' });
    }, 2000);
  });
});

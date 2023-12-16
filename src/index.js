window.$ = require('jquery')

import './style.scss'

$(() => {
  const $fix = $('#salaryFix') // оклад
  const $rk = $('#salaryRK') // районный коэффициент
  const $ndfl = $('#salaryNdfl') // НДФЛ
  const $hand = $('#salaryHand') // на руки
  const $result = $('#salaryAdd')

  const $allDays = $('#allDays')
  const $workedDays = $('#workedDays')
  const $salaryFixTotal = $('#salaryFixTotal')

  $('button#salaryCalc').on('click', salaryCalc)

  $('input').on('keyup change', () => {
    salaryCalc(false)
  })

  function validateInputs(focus = true) {
    $('input').removeClass('is-invalid')
    $result.removeClass('is-valid').val(0)
    $salaryFixTotal.text('')

    if (!$fix.val() || parseFloat($fix.val()) < 0.01) {
      if (focus) {
        $fix.focus().addClass('is-invalid')
      }
      return false
    }

    if (parseFloat($rk.val()) < 1 || parseFloat($rk.val()) >= 2) {
      if (focus) {
        $rk.focus().addClass('is-invalid')
      }
      return false
    }

    if (!$ndfl.val() || parseInt($ndfl.val()) < 0 || parseInt($ndfl.val()) > 100) {
      if (focus) {
        $ndfl.focus().addClass('is-invalid')
      }
      return false
    }

    if (!$hand.val() || parseFloat($hand.val()) < 1 || parseFloat($hand.val()) < parseFloat($fix.val())) {
      if (focus) {
        $hand.focus().addClass('is-invalid')
      }
      return false
    }

    if ($allDays.val().length || $workedDays.val().length) {
      if (!$allDays.val() || !$workedDays.val() || parseInt($allDays.val()) < parseInt($workedDays.val())) {
        if (focus) {
          $allDays.focus().addClass('is-invalid')
          $workedDays.addClass('is-invalid')
        }
        return false
      }
    }

    return true
  }

  function salaryCalc(focus) {
    if (validateInputs(focus)) {
      const salaryAndTax = $hand.val() / (100 - parseInt($ndfl.val())) * 100

      let salaryFix = parseFloat($fix.val())
      if ($workedDays.val()) {
        salaryFix = Math.ceil((salaryFix / parseInt($allDays.val()) * parseInt($workedDays.val())) * 100) / 100
        $salaryFixTotal.text(parseFloat($fix.val()) + ' / ' + parseInt($allDays.val()) + ' * ' + parseInt($workedDays.val()) + ' = ' + salaryFix)
      } else {
        $salaryFixTotal.text(salaryFix)
      }

      let res = salaryAndTax / parseFloat($rk.val())
      $result.val(Math.ceil((res - salaryFix) * 100) / 100).addClass('is-valid')
    }
  }

  $('#copySalaryAdd').click(function () {
    document.getElementById('salaryAdd').select();
    document.execCommand('copy')


    $(this).addClass('check')
    setTimeout(() => {
      $(this).removeClass('check')
    },1000)
  })
})
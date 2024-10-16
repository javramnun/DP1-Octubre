<%@ page session="false" trimDirectiveWhitespaces="true" %> <%@ taglib
prefix="spring" uri="http://www.springframework.org/tags" %> <%@ taglib
prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %> <%@ taglib
prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> <%@ taglib
prefix="petclinic" tagdir="/WEB-INF/tags" %>

<petclinic:layout pageName="finishGame">
  <h1 style="text-align: center; font-size: 64px">
    ${winner.username} won the game!
  </h1>

  <h2>Ranking:</h2>
  <c:forEach items="${scoreboards}" var="scoreboard">
    <h2>${scoreboard.user.username} Puntuacion: ${scoreboard.score}</h2>
  </c:forEach>
  <a class="btn btn-default" href="/">Go home</a>
</petclinic:layout>
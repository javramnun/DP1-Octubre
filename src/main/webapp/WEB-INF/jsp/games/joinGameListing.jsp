<%@ page session="false" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="petclinic" tagdir="/WEB-INF/tags" %>

<petclinic:layout pageName="games">
    <h2>List of current games</h2>

    <table id="gamesTable" class="table table-striped">
        <thead>
        <tr>
        	<th>Game</th>
            <th>Players</th>
            <th>Creator</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        <c:forEach items="${games}" var="game">
            <tr>
                <td>
                    <c:out value="Game #${game.id}"/>
                </td>
                <td>
                    <c:out value="${game.numberOfPlayers} / 4"/>
                </td>
                <td>
                	<c:out value="${game.scoreboards.get(0).user.username}"/>
                </td>
                <td>
                    <a class="btn btn-default" href="/games/${game.id}/join/${username}">Join</a>
                </td>
            </tr>
        </c:forEach>
        </tbody>
    </table>
    <a class="btn btn-default" href="/games/new">Create new game</a>
</petclinic:layout>